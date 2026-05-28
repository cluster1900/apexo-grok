//! Interface-layer server contracts.
//!
//! M1 exposes the first runnable HTTP router, OpenAPI contract, and SDK
//! generation seam without implementing the full opencode API surface yet.

#![forbid(unsafe_code)]

use axum::{Json, Router, routing::get};
use serde::Serialize;
use serde_json::{Value, json};
use thiserror::Error;
use tokio::net::TcpListener;
use tokio_util::sync::CancellationToken;

/// OpenAPI version emitted by the M1 contract endpoint.
pub const OPENAPI_VERSION: &str = "3.1.0";

/// Readiness state returned by the server health contract.
///
/// # Examples
///
/// ```
/// use opencode_server::Readiness;
///
/// assert_eq!(Readiness::Ready.as_str(), "ready");
/// ```
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Readiness {
    /// Server dependencies are ready for requests.
    Ready,
    /// Server has started but is still initializing dependencies.
    Starting,
}

impl Readiness {
    /// Returns the health-contract readiness label.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_server::Readiness;
    ///
    /// assert_eq!(Readiness::Starting.as_str(), "starting");
    /// ```
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Ready => "ready",
            Self::Starting => "starting",
        }
    }
}

/// Minimal health response for the M1 server skeleton.
///
/// # Examples
///
/// ```
/// use opencode_server::{HealthStatus, Readiness};
///
/// let status = HealthStatus::new(Readiness::Ready);
/// assert_eq!(status.readiness(), Readiness::Ready);
/// ```
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize)]
pub struct HealthStatus {
    service_name: &'static str,
    readiness: Readiness,
}

impl HealthStatus {
    /// Creates a health response with the stable opencode-rs service name.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_server::{HealthStatus, Readiness};
    ///
    /// let status = HealthStatus::new(Readiness::Ready);
    /// assert_eq!(status.service_name(), "opencode-rs");
    /// ```
    #[must_use]
    pub const fn new(readiness: Readiness) -> Self {
        Self {
            service_name: "opencode-rs",
            readiness,
        }
    }

    /// Returns the stable service name.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_server::{HealthStatus, Readiness};
    ///
    /// let status = HealthStatus::new(Readiness::Ready);
    /// assert_eq!(status.service_name(), "opencode-rs");
    /// ```
    #[must_use]
    pub const fn service_name(&self) -> &'static str {
        self.service_name
    }

    /// Returns the current readiness state.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_server::{HealthStatus, Readiness};
    ///
    /// let status = HealthStatus::new(Readiness::Starting);
    /// assert_eq!(status.readiness(), Readiness::Starting);
    /// ```
    #[must_use]
    pub const fn readiness(&self) -> Readiness {
        self.readiness
    }
}

/// Builds the current health status.
///
/// # Examples
///
/// ```
/// let status = opencode_server::health_status();
/// assert_eq!(status.service_name(), "opencode-rs");
/// ```
#[must_use]
pub const fn health_status() -> HealthStatus {
    HealthStatus::new(Readiness::Ready)
}

/// Error returned by the M1 server runner.
///
/// # Examples
///
/// ```
/// use opencode_server::ServerError;
///
/// let error = ServerError::serve("bind failed");
/// assert!(matches!(error, ServerError::Serve { .. }));
/// ```
#[derive(Debug, Error, Eq, PartialEq)]
pub enum ServerError {
    /// The HTTP server failed while binding or serving requests.
    #[error("opencode server failed: {message}")]
    Serve {
        /// Redacted server error message.
        message: Box<str>,
    },
}

impl ServerError {
    /// Creates a redacted server runner error.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_server::ServerError;
    ///
    /// let error = ServerError::serve("listener closed");
    /// assert!(matches!(error, ServerError::Serve { .. }));
    /// ```
    #[must_use]
    pub fn serve(message: impl Into<Box<str>>) -> Self {
        Self::Serve {
            message: message.into(),
        }
    }
}

/// Error returned by the M1 TypeScript SDK generator.
///
/// # Examples
///
/// ```
/// use opencode_server::SdkCodegenError;
///
/// let error = SdkCodegenError::missing_operation("global.health");
/// assert!(matches!(error, SdkCodegenError::MissingOperation { .. }));
/// ```
#[derive(Debug, Error, Eq, PartialEq)]
pub enum SdkCodegenError {
    /// The OpenAPI document did not contain a required operation id.
    #[error("OpenAPI document is missing operation: {operation_id}")]
    MissingOperation {
        /// Operation id required by the M1 SDK generator.
        operation_id: &'static str,
    },
    /// A generated SDK file path or content was empty.
    #[error("generated SDK file has an empty {field}")]
    EmptyGeneratedFileField {
        /// Field that failed validation.
        field: &'static str,
    },
}

impl SdkCodegenError {
    /// Creates a missing-operation error.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_server::SdkCodegenError;
    ///
    /// let error = SdkCodegenError::missing_operation("openapi.get");
    /// assert!(matches!(error, SdkCodegenError::MissingOperation { .. }));
    /// ```
    #[must_use]
    pub const fn missing_operation(operation_id: &'static str) -> Self {
        Self::MissingOperation { operation_id }
    }
}

/// Generated SDK file returned by the M1 SDK codegen runner.
///
/// # Examples
///
/// ```
/// use opencode_server::{GeneratedSdkFile, SdkCodegenError};
///
/// let file = GeneratedSdkFile::new("client.ts", "export {}")?;
/// assert_eq!(file.path(), "client.ts");
/// # Ok::<(), SdkCodegenError>(())
/// ```
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GeneratedSdkFile {
    path: Box<str>,
    contents: Box<str>,
}

impl GeneratedSdkFile {
    /// Creates a generated SDK file after validating path and contents.
    ///
    /// # Errors
    ///
    /// Returns [`SdkCodegenError::EmptyGeneratedFileField`] when `path` or
    /// `contents` is empty after trimming whitespace.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_server::{GeneratedSdkFile, SdkCodegenError};
    ///
    /// let file = GeneratedSdkFile::new("index.ts", "export * from './client';")?;
    /// assert_eq!(file.contents(), "export * from './client';");
    /// # Ok::<(), SdkCodegenError>(())
    /// ```
    pub fn new(
        path: impl Into<Box<str>>,
        contents: impl Into<Box<str>>,
    ) -> Result<Self, SdkCodegenError> {
        let path = require_generated_file_field("path", path.into())?;
        let contents = require_generated_file_field("contents", contents.into())?;

        Ok(Self { path, contents })
    }

    /// Returns the relative SDK output path.
    ///
    /// # Examples
    ///
    /// ```
    /// # use opencode_server::{GeneratedSdkFile, SdkCodegenError};
    /// # let file = GeneratedSdkFile::new("client.ts", "export {}")?;
    /// assert_eq!(file.path(), "client.ts");
    /// # Ok::<(), SdkCodegenError>(())
    /// ```
    #[must_use]
    pub fn path(&self) -> &str {
        &self.path
    }

    /// Returns the generated TypeScript source.
    ///
    /// # Examples
    ///
    /// ```
    /// # use opencode_server::{GeneratedSdkFile, SdkCodegenError};
    /// # let file = GeneratedSdkFile::new("client.ts", "export {}")?;
    /// assert_eq!(file.contents(), "export {}");
    /// # Ok::<(), SdkCodegenError>(())
    /// ```
    #[must_use]
    pub fn contents(&self) -> &str {
        &self.contents
    }
}

/// Builds the M1 HTTP router.
///
/// # Examples
///
/// ```
/// let _router = opencode_server::router();
/// ```
pub fn router() -> Router {
    Router::new()
        .route("/global/health", get(global_health))
        .route("/openapi.json", get(openapi_json))
}

/// Runs the M1 HTTP router until the cancellation token is cancelled.
///
/// # Errors
///
/// Returns [`ServerError::Serve`] when the underlying HTTP server exits with an
/// I/O error.
///
/// # Examples
///
/// ```no_run
/// # async fn example() -> Result<(), Box<dyn std::error::Error>> {
/// use opencode_server::{serve, ServerError};
/// use tokio::net::TcpListener;
/// use tokio_util::sync::CancellationToken;
///
/// let listener = TcpListener::bind("127.0.0.1:0").await?;
/// let shutdown = CancellationToken::new();
/// shutdown.cancel();
/// serve(listener, shutdown).await?;
/// # Ok::<(), Box<dyn std::error::Error>>(())
/// # }
/// ```
pub async fn serve(listener: TcpListener, shutdown: CancellationToken) -> Result<(), ServerError> {
    axum::serve(listener, router())
        .with_graceful_shutdown(async move {
            shutdown.cancelled().await;
        })
        .await
        .map_err(|error| ServerError::serve(error.to_string()))
}

/// Builds the M1 OpenAPI document.
///
/// The document intentionally covers only the M1 skeleton operations. Full
/// upstream compatibility is tracked separately by the 131-endpoint contract
/// inventory.
///
/// # Examples
///
/// ```
/// let document = opencode_server::openapi_document();
/// assert_eq!(document["openapi"], opencode_server::OPENAPI_VERSION);
/// ```
#[must_use]
pub fn openapi_document() -> Value {
    // Keep the M1 document static and explicit so SDK codegen tests can catch
    // drift before the full 131-operation generator is introduced.
    json!({
        "openapi": OPENAPI_VERSION,
        "info": {
            "title": "opencode-rs M1 API",
            "version": "0.1.0"
        },
        "paths": {
            "/global/health": {
                "get": {
                    "operationId": "global.health",
                    "summary": "Read global server health",
                    "responses": {
                        "200": {
                            "description": "Server readiness",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/HealthStatus"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/openapi.json": {
                "get": {
                    "operationId": "openapi.get",
                    "summary": "Read OpenAPI document",
                    "responses": {
                        "200": {
                            "description": "OpenAPI document",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "components": {
            "schemas": {
                "HealthStatus": {
                    "type": "object",
                    "required": ["service_name", "readiness"],
                    "properties": {
                        "service_name": {
                            "type": "string",
                            "const": "opencode-rs"
                        },
                        "readiness": {
                            "$ref": "#/components/schemas/Readiness"
                        }
                    }
                },
                "Readiness": {
                    "type": "string",
                    "enum": ["ready", "starting"]
                }
            }
        }
    })
}

/// Generates the M1 TypeScript SDK files from the OpenAPI document.
///
/// # Errors
///
/// Returns [`SdkCodegenError::MissingOperation`] when the supplied document does
/// not contain the M1 `global.health` or `openapi.get` operations. Returns
/// [`SdkCodegenError::EmptyGeneratedFileField`] if a generated file would be
/// empty.
///
/// # Examples
///
/// ```
/// use opencode_server::{generate_typescript_sdk, openapi_document, SdkCodegenError};
///
/// let files = generate_typescript_sdk(&openapi_document())?;
/// assert!(files.iter().any(|file| file.path() == "client.ts"));
/// # Ok::<(), SdkCodegenError>(())
/// ```
pub fn generate_typescript_sdk(document: &Value) -> Result<Vec<GeneratedSdkFile>, SdkCodegenError> {
    ensure_operation(document, "global.health")?;
    ensure_operation(document, "openapi.get")?;

    Ok(vec![
        GeneratedSdkFile::new("client.ts", TYPESCRIPT_CLIENT_SOURCE)?,
        GeneratedSdkFile::new("index.ts", "export * from './client';\n")?,
    ])
}

async fn global_health() -> Json<HealthStatus> {
    Json(health_status())
}

async fn openapi_json() -> Json<Value> {
    Json(openapi_document())
}

fn ensure_operation(document: &Value, operation_id: &'static str) -> Result<(), SdkCodegenError> {
    if operation_exists(document, operation_id) {
        Ok(())
    } else {
        Err(SdkCodegenError::missing_operation(operation_id))
    }
}

fn operation_exists(document: &Value, operation_id: &str) -> bool {
    let Some(paths) = document.get("paths").and_then(Value::as_object) else {
        return false;
    };

    paths
        .values()
        .filter_map(Value::as_object)
        .flat_map(|methods| methods.values())
        .any(|operation| {
            operation
                .get("operationId")
                .and_then(Value::as_str)
                .is_some_and(|item| item == operation_id)
        })
}

fn require_generated_file_field(
    field: &'static str,
    value: Box<str>,
) -> Result<Box<str>, SdkCodegenError> {
    if value.trim().is_empty() {
        return Err(SdkCodegenError::EmptyGeneratedFileField { field });
    }

    Ok(value)
}

const TYPESCRIPT_CLIENT_SOURCE: &str = r#"export type Readiness = "ready" | "starting";

export interface HealthStatus {
  service_name: "opencode-rs";
  readiness: Readiness;
}

export interface OpencodeClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export class OpencodeClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: OpencodeClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async getGlobalHealth(): Promise<HealthStatus> {
    return this.getJson("/global/health") as Promise<HealthStatus>;
  }

  async getOpenApiDocument(): Promise<unknown> {
    return this.getJson("/openapi.json");
  }

  private async getJson(path: string): Promise<unknown> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`opencode request failed: ${response.status}`);
    }
    return response.json();
  }
}
"#;

#[cfg(test)]
mod tests {
    use super::{generate_typescript_sdk, openapi_document, router, serve};
    use axum::body::{Body, to_bytes};
    use axum::http::{Request, StatusCode};
    use serde_json::Value;
    use std::error::Error;
    use tokio::net::TcpListener;
    use tokio_util::sync::CancellationToken;
    use tower::ServiceExt;

    #[tokio::test]
    async fn global_health_route_returns_ready_json() -> Result<(), Box<dyn Error>> {
        // Tests the M1 /global/health route with an in-memory axum router,
        // empty request body, and exact JSON assertions because Desktop waits
        // on this readiness contract before loading WebJS.
        let response = router()
            .oneshot(
                Request::builder()
                    .uri("/global/health")
                    .body(Body::empty())?,
            )
            .await?;

        let body = to_bytes(response.into_body(), usize::MAX).await?;
        let value: Value = serde_json::from_slice(&body)?;

        assert_eq!(value["service_name"], "opencode-rs");
        assert_eq!(value["readiness"], "ready");
        Ok(())
    }

    #[tokio::test]
    async fn openapi_route_exposes_m1_operations() -> Result<(), Box<dyn Error>> {
        // Tests /openapi.json through the router rather than the helper
        // function so route registration, operation IDs, and schema exposure
        // are verified together for SDK generation.
        let response = router()
            .oneshot(
                Request::builder()
                    .uri("/openapi.json")
                    .body(Body::empty())?,
            )
            .await?;

        assert_eq!(response.status(), StatusCode::OK);
        let body = to_bytes(response.into_body(), usize::MAX).await?;
        let value: Value = serde_json::from_slice(&body)?;

        assert_eq!(
            value["paths"]["/global/health"]["get"]["operationId"],
            "global.health"
        );
        assert_eq!(
            value["paths"]["/openapi.json"]["get"]["operationId"],
            "openapi.get"
        );
        Ok(())
    }

    #[test]
    fn openapi_document_matches_health_contract_schema() {
        // Tests the static OpenAPI schema against the M1 health response fields
        // because SDK generation and future contract diffs depend on exact
        // required properties for the first public server endpoint.
        let document = openapi_document();
        let health_schema = &document["components"]["schemas"]["HealthStatus"];
        let readiness_schema = &document["components"]["schemas"]["Readiness"];

        assert_eq!(document["openapi"], super::OPENAPI_VERSION);
        assert_eq!(
            health_schema["required"],
            serde_json::json!(["service_name", "readiness"])
        );
        assert_eq!(
            health_schema["properties"]["service_name"]["const"],
            "opencode-rs"
        );
        assert_eq!(
            readiness_schema["enum"],
            serde_json::json!(["ready", "starting"])
        );
    }

    #[tokio::test]
    async fn serve_binds_tcp_health_and_shutdowns() -> Result<(), Box<dyn Error>> {
        // Tests the real M1 TCP server with an ephemeral listener, reqwest HTTP
        // client, and CancellationToken shutdown because Desktop sidecar and
        // CLI serve paths need the same runner behavior.
        let listener = TcpListener::bind("127.0.0.1:0").await?;
        let address = listener.local_addr()?;
        let shutdown = CancellationToken::new();
        let handle = tokio::spawn(serve(listener, shutdown.clone()));

        let response = reqwest::get(format!("http://{address}/global/health")).await?;
        let value: Value = response.json().await?;

        shutdown.cancel();
        handle.await??;

        assert_eq!(value["service_name"], "opencode-rs");
        assert_eq!(value["readiness"], "ready");
        Ok(())
    }

    #[test]
    fn typescript_sdk_generation_requires_openapi_operations() -> Result<(), Box<dyn Error>> {
        // Tests the M1 SDK generation chain with the static OpenAPI document,
        // no filesystem writes, and generated source assertions because M1
        // only needs an auditable codegen seam.
        let files = generate_typescript_sdk(&openapi_document())?;
        let Some(client) = files.iter().find(|file| file.path() == "client.ts") else {
            return Err(std::io::Error::other("client.ts was not generated").into());
        };

        assert!(client.contents().contains("getGlobalHealth"));
        assert!(client.contents().contains("/openapi.json"));
        Ok(())
    }

    #[test]
    fn typescript_sdk_generation_rejects_missing_operation() {
        // Tests SDK codegen with an intentionally incomplete OpenAPI document
        // and a semantic error assertion because missing operation IDs must be
        // caught before generated SDK files are accepted.
        let result = generate_typescript_sdk(&serde_json::json!({
            "openapi": super::OPENAPI_VERSION,
            "paths": {}
        }));

        assert!(matches!(
            result,
            Err(super::SdkCodegenError::MissingOperation {
                operation_id: "global.health"
            })
        ));
    }

    #[test]
    fn generated_sdk_file_rejects_empty_fields() {
        // Tests GeneratedSdkFile validation with empty path and empty content
        // inputs because the codegen seam should fail fast before filesystem
        // writes are introduced in later milestones.
        let empty_path = super::GeneratedSdkFile::new("", "export {}");
        let empty_contents = super::GeneratedSdkFile::new("client.ts", "   ");

        assert!(matches!(
            empty_path,
            Err(super::SdkCodegenError::EmptyGeneratedFileField { field: "path" })
        ));
        assert!(matches!(
            empty_contents,
            Err(super::SdkCodegenError::EmptyGeneratedFileField { field: "contents" })
        ));
    }
}
