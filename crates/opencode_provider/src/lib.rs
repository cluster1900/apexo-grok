//! Provider infrastructure adapters for opencode-rs.
//!
//! M1 only establishes the adapter boundary. Protocol-specific modules for
//! OpenAI Chat, OpenAI Responses, Anthropic Messages, Gemini, Bedrock Converse,
//! and OpenAI-compatible providers are added after contract fixtures land.

#![forbid(unsafe_code)]

use opencode_application::{
    ChatProviderPort, ChatRequest, ChatResponse, ProviderError, ProviderFuture,
};

/// Shared HTTP transport used by provider protocol adapters.
///
/// # Examples
///
/// ```
/// use opencode_provider::HttpProviderTransport;
///
/// let transport = HttpProviderTransport::default();
/// let _client = transport.client();
/// ```
#[derive(Clone, Debug)]
pub struct HttpProviderTransport {
    client: reqwest::Client,
}

impl HttpProviderTransport {
    /// Creates a transport from an already configured reqwest client.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_provider::HttpProviderTransport;
    ///
    /// let transport = HttpProviderTransport::new(reqwest::Client::new());
    /// let _client = transport.client();
    /// ```
    #[must_use]
    pub const fn new(client: reqwest::Client) -> Self {
        Self { client }
    }

    /// Returns the underlying HTTP client.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_provider::HttpProviderTransport;
    ///
    /// let transport = HttpProviderTransport::default();
    /// let _client = transport.client();
    /// ```
    #[must_use]
    pub const fn client(&self) -> &reqwest::Client {
        &self.client
    }
}

impl Default for HttpProviderTransport {
    fn default() -> Self {
        Self::new(reqwest::Client::new())
    }
}

/// Placeholder provider adapter used until protocol-specific adapters land.
///
/// The adapter intentionally returns [`ProviderError::Unsupported`] so M1 can
/// compile the boundary without pretending that provider protocol support is
/// implemented.
///
/// # Examples
///
/// ```
/// use opencode_provider::{HttpChatProvider, HttpProviderTransport};
///
/// let adapter = HttpChatProvider::new(HttpProviderTransport::default());
/// let _transport = adapter.transport();
/// ```
#[derive(Clone, Debug)]
pub struct HttpChatProvider {
    transport: HttpProviderTransport,
}

impl HttpChatProvider {
    /// Creates a placeholder HTTP chat provider adapter.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_provider::{HttpChatProvider, HttpProviderTransport};
    ///
    /// let adapter = HttpChatProvider::new(HttpProviderTransport::default());
    /// let _transport = adapter.transport();
    /// ```
    #[must_use]
    pub const fn new(transport: HttpProviderTransport) -> Self {
        Self { transport }
    }

    /// Returns the configured provider transport.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_provider::{HttpChatProvider, HttpProviderTransport};
    ///
    /// let adapter = HttpChatProvider::new(HttpProviderTransport::default());
    /// let _transport = adapter.transport();
    /// ```
    #[must_use]
    pub const fn transport(&self) -> &HttpProviderTransport {
        &self.transport
    }
}

impl ChatProviderPort for HttpChatProvider {
    fn send_chat<'a>(&'a self, request: ChatRequest) -> ProviderFuture<'a, ChatResponse> {
        Box::pin(async move {
            // Touch the selected route values now so future protocol dispatch
            // can be added without changing the application port signature.
            let _client = self.transport.client();
            let _provider_id = request.provider_id();
            let _model_id = request.model_id();

            Err(ProviderError::Unsupported {
                feature: "provider protocol dispatch",
            })
        })
    }
}
