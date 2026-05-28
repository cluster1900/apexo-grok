//! Domain value objects shared by opencode-rs bounded contexts.
//!
//! This crate stays free of I/O and runtime dependencies. Infrastructure and
//! interface crates must depend inward on these types instead of passing raw
//! provider, model, session, or workspace identifiers across boundaries.

#![forbid(unsafe_code)]

mod ids;

pub use ids::{IdentifierError, IdentifierKind, ModelId, ProviderId, SessionId};
