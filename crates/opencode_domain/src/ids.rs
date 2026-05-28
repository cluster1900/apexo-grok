use serde::{Deserialize, Serialize};
use std::fmt;
use thiserror::Error;

/// Identifies which domain identifier failed validation.
///
/// # Examples
///
/// ```
/// use opencode_domain::IdentifierKind;
///
/// assert_eq!(IdentifierKind::Provider.as_str(), "provider");
/// ```
#[derive(Clone, Copy, Debug, Eq, Error, PartialEq)]
pub enum IdentifierKind {
    /// Provider identifier such as `openai` or `github-copilot`.
    #[error("provider")]
    Provider,
    /// Model identifier such as `gpt-5` or `anthropic/claude-sonnet`.
    #[error("model")]
    Model,
    /// Session identifier emitted by opencode session storage.
    #[error("session")]
    Session,
}

impl IdentifierKind {
    /// Returns the lowercase identifier kind used in validation errors.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_domain::IdentifierKind;
    ///
    /// assert_eq!(IdentifierKind::Model.as_str(), "model");
    /// ```
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Provider => "provider",
            Self::Model => "model",
            Self::Session => "session",
        }
    }
}

/// Error returned when an identifier value violates domain constraints.
///
/// # Examples
///
/// ```
/// use opencode_domain::{IdentifierError, ProviderId};
///
/// let result = ProviderId::try_from("");
/// assert!(matches!(result, Err(IdentifierError::Empty { .. })));
/// ```
#[derive(Debug, Error, Eq, PartialEq)]
pub enum IdentifierError {
    /// The identifier was empty after trimming whitespace.
    #[error("{kind} id cannot be empty")]
    Empty {
        /// Identifier kind that failed validation.
        kind: IdentifierKind,
    },
    /// The identifier exceeded the configured byte length.
    #[error("{kind} id cannot exceed {max} bytes")]
    TooLong {
        /// Identifier kind that failed validation.
        kind: IdentifierKind,
        /// Maximum accepted byte length.
        max: usize,
    },
    /// The identifier contained a character outside the allowed set.
    #[error("{kind} id contains an invalid character")]
    InvalidCharacter {
        /// Identifier kind that failed validation.
        kind: IdentifierKind,
    },
}

/// Stable provider identifier used across catalog, auth, and request routing.
///
/// Provider identifiers are private newtypes so external layers cannot smuggle
/// unchecked strings into the domain model.
///
/// # Examples
///
/// ```
/// use opencode_domain::{IdentifierError, ProviderId};
///
/// let provider = ProviderId::try_from("openai")?;
/// assert_eq!(provider.as_str(), "openai");
/// # Ok::<(), IdentifierError>(())
/// ```
#[derive(Clone, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(try_from = "String", into = "String")]
pub struct ProviderId(String);

impl ProviderId {
    /// Builds a provider id after applying opencode provider validation.
    ///
    /// # Errors
    ///
    /// Returns [`IdentifierError`] when the value is empty, too long, or
    /// contains characters outside `[A-Za-z0-9_.-]`.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_domain::{IdentifierError, ProviderId};
    ///
    /// let provider = ProviderId::new("github-copilot")?;
    /// assert_eq!(provider.as_str(), "github-copilot");
    /// # Ok::<(), IdentifierError>(())
    /// ```
    pub fn new(value: impl Into<String>) -> Result<Self, IdentifierError> {
        validate_identifier(
            IdentifierKind::Provider,
            value.into(),
            128,
            IdentifierMode::Provider,
        )
        .map(Self)
    }

    /// Returns the validated provider id as a string slice.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_domain::{IdentifierError, ProviderId};
    ///
    /// let provider = ProviderId::try_from("openrouter")?;
    /// assert_eq!(provider.as_str(), "openrouter");
    /// # Ok::<(), IdentifierError>(())
    /// ```
    #[must_use]
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl TryFrom<String> for ProviderId {
    type Error = IdentifierError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Self::new(value)
    }
}

impl TryFrom<&str> for ProviderId {
    type Error = IdentifierError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Self::new(value)
    }
}

impl From<ProviderId> for String {
    fn from(value: ProviderId) -> Self {
        value.0
    }
}

impl fmt::Display for ProviderId {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.as_str())
    }
}

/// Stable model identifier used when selecting provider catalog entries.
///
/// # Examples
///
/// ```
/// use opencode_domain::{IdentifierError, ModelId};
///
/// let model = ModelId::try_from("openai/gpt-5")?;
/// assert_eq!(model.as_str(), "openai/gpt-5");
/// # Ok::<(), IdentifierError>(())
/// ```
#[derive(Clone, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(try_from = "String", into = "String")]
pub struct ModelId(String);

impl ModelId {
    /// Builds a model id after applying opencode model validation.
    ///
    /// # Errors
    ///
    /// Returns [`IdentifierError`] when the value is empty, too long, or
    /// contains a JSON/control character that cannot safely cross boundaries.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_domain::{IdentifierError, ModelId};
    ///
    /// let model = ModelId::new("claude-sonnet-4")?;
    /// assert_eq!(model.as_str(), "claude-sonnet-4");
    /// # Ok::<(), IdentifierError>(())
    /// ```
    pub fn new(value: impl Into<String>) -> Result<Self, IdentifierError> {
        validate_identifier(
            IdentifierKind::Model,
            value.into(),
            256,
            IdentifierMode::Model,
        )
        .map(Self)
    }

    /// Returns the validated model id as a string slice.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_domain::{IdentifierError, ModelId};
    ///
    /// let model = ModelId::try_from("gpt-5")?;
    /// assert_eq!(model.as_str(), "gpt-5");
    /// # Ok::<(), IdentifierError>(())
    /// ```
    #[must_use]
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl TryFrom<String> for ModelId {
    type Error = IdentifierError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Self::new(value)
    }
}

impl TryFrom<&str> for ModelId {
    type Error = IdentifierError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Self::new(value)
    }
}

impl From<ModelId> for String {
    fn from(value: ModelId) -> Self {
        value.0
    }
}

impl fmt::Display for ModelId {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.as_str())
    }
}

/// Stable session identifier used by application use cases.
///
/// # Examples
///
/// ```
/// use opencode_domain::{IdentifierError, SessionId};
///
/// let session = SessionId::try_from("ses_01")?;
/// assert_eq!(session.as_str(), "ses_01");
/// # Ok::<(), IdentifierError>(())
/// ```
#[derive(Clone, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(try_from = "String", into = "String")]
pub struct SessionId(String);

impl SessionId {
    /// Builds a session id after applying opencode session validation.
    ///
    /// # Errors
    ///
    /// Returns [`IdentifierError`] when the value is empty, too long, or
    /// contains characters outside `[A-Za-z0-9_.-]`.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_domain::{IdentifierError, SessionId};
    ///
    /// let session = SessionId::new("ses_01")?;
    /// assert_eq!(session.as_str(), "ses_01");
    /// # Ok::<(), IdentifierError>(())
    /// ```
    pub fn new(value: impl Into<String>) -> Result<Self, IdentifierError> {
        validate_identifier(
            IdentifierKind::Session,
            value.into(),
            128,
            IdentifierMode::Provider,
        )
        .map(Self)
    }

    /// Returns the validated session id as a string slice.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_domain::{IdentifierError, SessionId};
    ///
    /// let session = SessionId::try_from("session-1")?;
    /// assert_eq!(session.as_str(), "session-1");
    /// # Ok::<(), IdentifierError>(())
    /// ```
    #[must_use]
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl TryFrom<String> for SessionId {
    type Error = IdentifierError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Self::new(value)
    }
}

impl TryFrom<&str> for SessionId {
    type Error = IdentifierError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Self::new(value)
    }
}

impl From<SessionId> for String {
    fn from(value: SessionId) -> Self {
        value.0
    }
}

impl fmt::Display for SessionId {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.as_str())
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum IdentifierMode {
    Provider,
    Model,
}

fn validate_identifier(
    kind: IdentifierKind,
    value: String,
    max: usize,
    mode: IdentifierMode,
) -> Result<String, IdentifierError> {
    let trimmed = value.trim().to_owned();
    if trimmed.is_empty() {
        return Err(IdentifierError::Empty { kind });
    }
    if trimmed.len() > max {
        return Err(IdentifierError::TooLong { kind, max });
    }

    // Provider/session ids are intentionally stricter than model ids because
    // they become route keys, while model ids must preserve upstream slashes.
    let valid = match mode {
        IdentifierMode::Provider => trimmed
            .chars()
            .all(|item| item.is_ascii_alphanumeric() || matches!(item, '_' | '-' | '.')),
        IdentifierMode::Model => trimmed.chars().all(|item| !item.is_control()),
    };
    if valid {
        Ok(trimmed)
    } else {
        Err(IdentifierError::InvalidCharacter { kind })
    }
}

#[cfg(test)]
mod tests {
    use super::{IdentifierError, ModelId, ProviderId, SessionId};

    #[test]
    fn provider_id_rejects_blank_values() {
        // Verifies ProviderId validation with a whitespace input because
        // provider IDs are route keys and must fail before interface routing.
        let result = ProviderId::try_from("  ");

        assert!(matches!(result, Err(IdentifierError::Empty { .. })));
    }

    #[test]
    fn provider_id_rejects_slashes() {
        // Verifies ProviderId rejects model-like values because upstream
        // provider routing uses stable provider IDs without path separators.
        let result = ProviderId::try_from("openai/gpt-5");

        assert!(matches!(
            result,
            Err(IdentifierError::InvalidCharacter { .. })
        ));
    }

    #[test]
    fn model_id_preserves_provider_slashes() {
        // Verifies ModelId preserves OpenRouter and Copilot style IDs because
        // adapter routing must not normalize upstream model identifiers.
        let result = ModelId::try_from("openai/gpt-5");

        assert!(matches!(result, Ok(value) if value.as_str() == "openai/gpt-5"));
    }

    #[test]
    fn session_id_uses_provider_style_validation() {
        // Verifies SessionId follows route-safe identifier rules because it is
        // used by HTTP, storage, and event stream boundaries.
        let result = SessionId::try_from("ses_01");

        assert!(matches!(result, Ok(value) if value.as_str() == "ses_01"));
    }

    #[test]
    fn provider_id_serde_round_trip_preserves_value() -> Result<(), Box<dyn std::error::Error>> {
        // Verifies ProviderId serde round-trip with a route-safe provider id
        // because M1 HTTP and provider registry boundaries rely on serde using
        // the same validation path as direct constructors.
        let provider = ProviderId::try_from("github-copilot")?;

        let encoded = serde_json::to_string(&provider)?;
        let decoded: ProviderId = serde_json::from_str(&encoded)?;

        assert_eq!(encoded, "\"github-copilot\"");
        assert_eq!(decoded, provider);
        Ok(())
    }

    #[test]
    fn provider_id_deserialize_rejects_invalid_route_key() {
        // Verifies ProviderId deserialization rejects a model-like value
        // because serde must not bypass domain validation at public boundaries.
        let result = serde_json::from_str::<ProviderId>("\"openai/gpt-5\"");

        assert!(result.is_err());
    }
}
