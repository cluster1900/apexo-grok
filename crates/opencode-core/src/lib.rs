//! Minimal core crate for the redesigned opencode-rs baseline.
//!
//! This crate intentionally contains only stable reset metadata until the first
//! real vertical slice is selected.

#![forbid(unsafe_code)]

/// Project name used by command and documentation surfaces.
///
/// # Examples
///
/// ```
/// assert_eq!(opencode_core::PROJECT_NAME, "opencode-rs");
/// ```
pub const PROJECT_NAME: &str = "opencode-rs";

/// Current reset baseline status.
///
/// # Examples
///
/// ```
/// use opencode_core::{BaselineStatus, current_baseline};
///
/// assert_eq!(current_baseline().status(), BaselineStatus::Redesigning);
/// ```
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum BaselineStatus {
    /// The repository has been reset and is waiting for the first real slice.
    Redesigning,
}

impl BaselineStatus {
    /// Returns the stable machine-readable status label.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_core::BaselineStatus;
    ///
    /// assert_eq!(BaselineStatus::Redesigning.as_str(), "redesigning");
    /// ```
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Redesigning => "redesigning",
        }
    }
}

/// Describes the current repository baseline after reinitialization.
///
/// # Examples
///
/// ```
/// let baseline = opencode_core::current_baseline();
///
/// assert_eq!(baseline.project_name(), "opencode-rs");
/// ```
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct ResetBaseline {
    project_name: &'static str,
    status: BaselineStatus,
}

impl ResetBaseline {
    /// Creates a reset baseline descriptor.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_core::{BaselineStatus, ResetBaseline};
    ///
    /// let baseline = ResetBaseline::new("opencode-rs", BaselineStatus::Redesigning);
    /// assert_eq!(baseline.status(), BaselineStatus::Redesigning);
    /// ```
    #[must_use]
    pub const fn new(project_name: &'static str, status: BaselineStatus) -> Self {
        Self {
            project_name,
            status,
        }
    }

    /// Returns the project name associated with this baseline.
    ///
    /// # Examples
    ///
    /// ```
    /// let baseline = opencode_core::current_baseline();
    ///
    /// assert_eq!(baseline.project_name(), "opencode-rs");
    /// ```
    #[must_use]
    pub const fn project_name(self) -> &'static str {
        self.project_name
    }

    /// Returns the current reset status.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_core::{BaselineStatus, current_baseline};
    ///
    /// assert_eq!(current_baseline().status(), BaselineStatus::Redesigning);
    /// ```
    #[must_use]
    pub const fn status(self) -> BaselineStatus {
        self.status
    }
}

/// Returns the current reset baseline.
///
/// # Examples
///
/// ```
/// use opencode_core::{BaselineStatus, current_baseline};
///
/// let baseline = current_baseline();
/// assert_eq!(baseline.status(), BaselineStatus::Redesigning);
/// ```
#[must_use]
pub const fn current_baseline() -> ResetBaseline {
    ResetBaseline::new(PROJECT_NAME, BaselineStatus::Redesigning)
}

#[cfg(test)]
mod tests {
    use super::{BaselineStatus, PROJECT_NAME, current_baseline};

    #[test]
    fn current_baseline_marks_repository_as_redesigning() {
        // Tests the reset metadata exported by opencode-core, with no external
        // input, and asserts exact values because downstream commands rely on
        // these labels to describe the current baseline.
        let baseline = current_baseline();

        assert_eq!(baseline.project_name(), PROJECT_NAME);
        assert_eq!(baseline.status(), BaselineStatus::Redesigning);
        assert_eq!(baseline.status().as_str(), "redesigning");
    }
}
