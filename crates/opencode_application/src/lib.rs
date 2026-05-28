//! Application layer ports and use-case DTOs.
//!
//! This crate defines orchestration-facing contracts without depending on
//! infrastructure crates. Provider implementations live outside this crate and
//! implement these ports from the infrastructure side.

#![forbid(unsafe_code)]

mod provider_registry;

use opencode_domain::{ModelId, ProviderId, SessionId};
use std::future::Future;
use std::pin::Pin;
use thiserror::Error;

pub use provider_registry::ProviderRegistry;

/// Boxed future returned by application ports without using `async_trait`.
///
/// # Examples
///
/// ```
/// use opencode_application::{ProviderError, ProviderFuture};
///
/// fn immediate<'a>() -> ProviderFuture<'a, ()> {
///     Box::pin(async { Ok::<(), ProviderError>(()) })
/// }
/// ```
pub type ProviderFuture<'a, T> =
    Pin<Box<dyn Future<Output = Result<T, ProviderError>> + Send + 'a>>;

/// Errors returned by provider-facing application ports.
///
/// # Examples
///
/// ```
/// use opencode_application::ProviderError;
///
/// let error = ProviderError::auth_required("openai");
/// assert!(matches!(error, ProviderError::AuthRequired { .. }));
/// ```
#[derive(Debug, Error, Eq, PartialEq)]
pub enum ProviderError {
    /// Provider credentials are missing or unavailable.
    #[error("provider auth required: {provider}")]
    AuthRequired {
        /// Provider id as displayed in user-facing errors.
        provider: Box<str>,
    },
    /// The selected provider is not registered in the application registry.
    #[error("provider not found: {provider}")]
    ProviderNotFound {
        /// Provider id requested by the caller.
        provider: Box<str>,
    },
    /// Request failed before receiving a provider response.
    #[error("provider transport failed: {message}")]
    Transport {
        /// Redacted transport error message.
        message: Box<str>,
    },
    /// Provider stream could not be parsed into opencode events.
    #[error("provider stream frame is invalid: {message}")]
    StreamInvalid {
        /// Redacted stream parse error message.
        message: Box<str>,
    },
    /// The requested provider capability is not implemented yet.
    #[error("provider feature is not implemented: {feature}")]
    Unsupported {
        /// Feature name that should be implemented by a later adapter.
        feature: &'static str,
    },
}

impl ProviderError {
    /// Creates an auth-required error with a redacted provider label.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::ProviderError;
    ///
    /// let error = ProviderError::auth_required("openai");
    /// assert!(matches!(error, ProviderError::AuthRequired { .. }));
    /// ```
    #[must_use]
    pub fn auth_required(provider: impl Into<Box<str>>) -> Self {
        Self::AuthRequired {
            provider: provider.into(),
        }
    }

    /// Creates a provider-not-found error with the selected provider id.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::ProviderError;
    ///
    /// let error = ProviderError::provider_not_found("anthropic");
    /// assert!(matches!(error, ProviderError::ProviderNotFound { .. }));
    /// ```
    #[must_use]
    pub fn provider_not_found(provider: impl Into<Box<str>>) -> Self {
        Self::ProviderNotFound {
            provider: provider.into(),
        }
    }

    /// Creates a redacted transport error.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::ProviderError;
    ///
    /// let error = ProviderError::transport("timeout");
    /// assert!(matches!(error, ProviderError::Transport { .. }));
    /// ```
    #[must_use]
    pub fn transport(message: impl Into<Box<str>>) -> Self {
        Self::Transport {
            message: message.into(),
        }
    }
}

/// Role of a message sent to a provider adapter.
///
/// # Examples
///
/// ```
/// use opencode_application::ChatRole;
///
/// assert_eq!(ChatRole::User.as_str(), "user");
/// ```
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ChatRole {
    /// System instruction message.
    System,
    /// User-authored message.
    User,
    /// Assistant-authored message replayed into context.
    Assistant,
}

impl ChatRole {
    /// Returns the wire-compatible role label.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::ChatRole;
    ///
    /// assert_eq!(ChatRole::Assistant.as_str(), "assistant");
    /// ```
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::System => "system",
            Self::User => "user",
            Self::Assistant => "assistant",
        }
    }
}

/// Provider-neutral text message used by the M1 provider port skeleton.
///
/// # Examples
///
/// ```
/// use opencode_application::{ChatMessage, ChatRole, ProviderError};
///
/// let message = ChatMessage::new(ChatRole::User, "hello")?;
/// assert_eq!(message.content(), "hello");
/// # Ok::<(), ProviderError>(())
/// ```
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ChatMessage {
    role: ChatRole,
    content: Box<str>,
}

impl ChatMessage {
    /// Creates a message after checking that the content is not empty.
    ///
    /// # Errors
    ///
    /// Returns [`ProviderError::StreamInvalid`] when the content is empty after
    /// trimming. Full part validation is added when message/part schemas land.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{ChatMessage, ChatRole, ProviderError};
    ///
    /// let message = ChatMessage::new(ChatRole::System, "be concise")?;
    /// assert_eq!(message.role(), ChatRole::System);
    /// # Ok::<(), ProviderError>(())
    /// ```
    pub fn new(role: ChatRole, content: impl Into<Box<str>>) -> Result<Self, ProviderError> {
        let content = content.into();
        if content.trim().is_empty() {
            return Err(ProviderError::StreamInvalid {
                message: "chat message content cannot be empty".into(),
            });
        }

        Ok(Self { role, content })
    }

    /// Returns the message role.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{ChatMessage, ChatRole, ProviderError};
    ///
    /// let message = ChatMessage::new(ChatRole::User, "hello")?;
    /// assert_eq!(message.role(), ChatRole::User);
    /// # Ok::<(), ProviderError>(())
    /// ```
    #[must_use]
    pub const fn role(&self) -> ChatRole {
        self.role
    }

    /// Returns the message content.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{ChatMessage, ChatRole, ProviderError};
    ///
    /// let message = ChatMessage::new(ChatRole::User, "hello")?;
    /// assert_eq!(message.content(), "hello");
    /// # Ok::<(), ProviderError>(())
    /// ```
    #[must_use]
    pub fn content(&self) -> &str {
        &self.content
    }
}

/// Provider request shape used by application use cases.
///
/// # Examples
///
/// ```
/// use opencode_application::{ChatMessage, ChatRequest, ChatRole, ProviderError};
/// use opencode_domain::{IdentifierError, ModelId, ProviderId, SessionId};
///
/// let request = ChatRequest::new(
///     SessionId::try_from("ses_01")?,
///     ProviderId::try_from("openai")?,
///     ModelId::try_from("gpt-5")?,
///     vec![ChatMessage::new(ChatRole::User, "hello")?],
/// )?;
/// assert_eq!(request.provider_id().as_str(), "openai");
/// # Ok::<(), Box<dyn std::error::Error>>(())
/// ```
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ChatRequest {
    session_id: SessionId,
    provider_id: ProviderId,
    model_id: ModelId,
    messages: Vec<ChatMessage>,
}

impl ChatRequest {
    /// Creates a provider request with at least one message.
    ///
    /// # Errors
    ///
    /// Returns [`ProviderError::StreamInvalid`] when the message list is empty.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{ChatMessage, ChatRequest, ChatRole, ProviderError};
    /// use opencode_domain::{ModelId, ProviderId, SessionId};
    ///
    /// let request = ChatRequest::new(
    ///     SessionId::try_from("ses_01")?,
    ///     ProviderId::try_from("openai")?,
    ///     ModelId::try_from("gpt-5")?,
    ///     vec![ChatMessage::new(ChatRole::User, "hello")?],
    /// )?;
    /// assert_eq!(request.messages().len(), 1);
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    pub fn new(
        session_id: SessionId,
        provider_id: ProviderId,
        model_id: ModelId,
        messages: Vec<ChatMessage>,
    ) -> Result<Self, ProviderError> {
        if messages.is_empty() {
            return Err(ProviderError::StreamInvalid {
                message: "chat request must contain at least one message".into(),
            });
        }

        Ok(Self {
            session_id,
            provider_id,
            model_id,
            messages,
        })
    }

    /// Returns the session id associated with this request.
    ///
    /// # Examples
    ///
    /// ```
    /// # use opencode_application::{ChatMessage, ChatRequest, ChatRole};
    /// # use opencode_domain::{ModelId, ProviderId, SessionId};
    /// # let request = ChatRequest::new(
    /// #     SessionId::try_from("ses_01")?,
    /// #     ProviderId::try_from("openai")?,
    /// #     ModelId::try_from("gpt-5")?,
    /// #     vec![ChatMessage::new(ChatRole::User, "hello")?],
    /// # )?;
    /// assert_eq!(request.session_id().as_str(), "ses_01");
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    #[must_use]
    pub const fn session_id(&self) -> &SessionId {
        &self.session_id
    }

    /// Returns the provider id selected by application orchestration.
    ///
    /// # Examples
    ///
    /// ```
    /// # use opencode_application::{ChatMessage, ChatRequest, ChatRole};
    /// # use opencode_domain::{ModelId, ProviderId, SessionId};
    /// # let request = ChatRequest::new(
    /// #     SessionId::try_from("ses_01")?,
    /// #     ProviderId::try_from("openai")?,
    /// #     ModelId::try_from("gpt-5")?,
    /// #     vec![ChatMessage::new(ChatRole::User, "hello")?],
    /// # )?;
    /// assert_eq!(request.provider_id().as_str(), "openai");
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    #[must_use]
    pub const fn provider_id(&self) -> &ProviderId {
        &self.provider_id
    }

    /// Returns the selected model id.
    ///
    /// # Examples
    ///
    /// ```
    /// # use opencode_application::{ChatMessage, ChatRequest, ChatRole};
    /// # use opencode_domain::{ModelId, ProviderId, SessionId};
    /// # let request = ChatRequest::new(
    /// #     SessionId::try_from("ses_01")?,
    /// #     ProviderId::try_from("openai")?,
    /// #     ModelId::try_from("gpt-5")?,
    /// #     vec![ChatMessage::new(ChatRole::User, "hello")?],
    /// # )?;
    /// assert_eq!(request.model_id().as_str(), "gpt-5");
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    #[must_use]
    pub const fn model_id(&self) -> &ModelId {
        &self.model_id
    }

    /// Returns the provider-neutral messages.
    ///
    /// # Examples
    ///
    /// ```
    /// # use opencode_application::{ChatMessage, ChatRequest, ChatRole};
    /// # use opencode_domain::{ModelId, ProviderId, SessionId};
    /// # let request = ChatRequest::new(
    /// #     SessionId::try_from("ses_01")?,
    /// #     ProviderId::try_from("openai")?,
    /// #     ModelId::try_from("gpt-5")?,
    /// #     vec![ChatMessage::new(ChatRole::User, "hello")?],
    /// # )?;
    /// assert_eq!(request.messages().len(), 1);
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    #[must_use]
    pub fn messages(&self) -> &[ChatMessage] {
        &self.messages
    }
}

/// Provider response finish reason normalized for application use cases.
///
/// # Examples
///
/// ```
/// use opencode_application::FinishReason;
///
/// assert_eq!(FinishReason::Stop.as_str(), "stop");
/// ```
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum FinishReason {
    /// Provider stopped normally.
    Stop,
    /// Provider requested one or more tool calls.
    ToolCalls,
    /// Provider stopped because output length was exhausted.
    Length,
}

impl FinishReason {
    /// Returns the provider-neutral finish reason label.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::FinishReason;
    ///
    /// assert_eq!(FinishReason::ToolCalls.as_str(), "tool-calls");
    /// ```
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Stop => "stop",
            Self::ToolCalls => "tool-calls",
            Self::Length => "length",
        }
    }
}

/// Provider-neutral response returned by a chat provider port.
///
/// # Examples
///
/// ```
/// use opencode_application::{ChatResponse, FinishReason};
///
/// let response = ChatResponse::new("hello", Some(FinishReason::Stop));
/// assert_eq!(response.output(), "hello");
/// ```
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ChatResponse {
    output: Box<str>,
    finish_reason: Option<FinishReason>,
}

impl ChatResponse {
    /// Creates a provider response from normalized text and finish reason.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{ChatResponse, FinishReason};
    ///
    /// let response = ChatResponse::new("hello", Some(FinishReason::Stop));
    /// assert_eq!(response.finish_reason(), Some(FinishReason::Stop));
    /// ```
    #[must_use]
    pub fn new(output: impl Into<Box<str>>, finish_reason: Option<FinishReason>) -> Self {
        Self {
            output: output.into(),
            finish_reason,
        }
    }

    /// Returns the normalized text output.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::ChatResponse;
    ///
    /// let response = ChatResponse::new("hello", None);
    /// assert_eq!(response.output(), "hello");
    /// ```
    #[must_use]
    pub fn output(&self) -> &str {
        &self.output
    }

    /// Returns the optional finish reason.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{ChatResponse, FinishReason};
    ///
    /// let response = ChatResponse::new("hello", Some(FinishReason::Length));
    /// assert_eq!(response.finish_reason(), Some(FinishReason::Length));
    /// ```
    #[must_use]
    pub const fn finish_reason(&self) -> Option<FinishReason> {
        self.finish_reason
    }
}

/// Application port implemented by provider infrastructure adapters.
///
/// The trait exists at M1 because mock and real adapters are both required by
/// the next implementation sprint and by provider contract tests.
///
/// # Examples
///
/// ```
/// use opencode_application::{ChatProviderPort, ChatRequest, ChatResponse, ProviderFuture};
///
/// struct UnsupportedProvider;
///
/// impl ChatProviderPort for UnsupportedProvider {
///     fn send_chat<'a>(&'a self, _request: ChatRequest) -> ProviderFuture<'a, ChatResponse> {
///         Box::pin(async {
///             Err(opencode_application::ProviderError::Unsupported {
///                 feature: "example",
///             })
///         })
///     }
/// }
/// ```
pub trait ChatProviderPort: Send + Sync {
    /// Sends a normalized chat request through the provider implementation.
    ///
    /// # Errors
    ///
    /// Returns [`ProviderError`] for auth, transport, stream parsing, and
    /// unsupported provider behavior.
    ///
    /// # Examples
    ///
    /// ```
    /// # use opencode_application::{ChatProviderPort, ChatRequest, ChatResponse, ProviderFuture};
    /// # struct UnsupportedProvider;
    /// # impl ChatProviderPort for UnsupportedProvider {
    /// fn send_chat<'a>(&'a self, _request: ChatRequest) -> ProviderFuture<'a, ChatResponse> {
    ///     Box::pin(async {
    ///         Err(opencode_application::ProviderError::Unsupported {
    ///             feature: "example",
    ///         })
    ///     })
    /// }
    /// # }
    /// ```
    fn send_chat<'a>(&'a self, request: ChatRequest) -> ProviderFuture<'a, ChatResponse>;
}
