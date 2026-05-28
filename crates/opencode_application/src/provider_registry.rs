use crate::{ChatProviderPort, ChatRequest, ChatResponse, ProviderError, ProviderFuture};
use opencode_domain::ProviderId;
use std::collections::BTreeMap;
use std::sync::Arc;

/// Application-level provider router used by chat send use cases.
///
/// The registry stores provider adapters behind the [`ChatProviderPort`] port so
/// application orchestration can route by validated [`ProviderId`] without
/// depending on infrastructure crates.
///
/// # Examples
///
/// ```
/// use opencode_application::ProviderRegistry;
///
/// let registry = ProviderRegistry::default();
/// let _future_router = registry;
/// ```
#[derive(Clone, Default)]
pub struct ProviderRegistry {
    providers: BTreeMap<ProviderId, Arc<dyn ChatProviderPort>>,
}

impl ProviderRegistry {
    /// Registers a provider adapter for later chat routing.
    ///
    /// Existing entries are replaced so config reloads can swap adapters while
    /// preserving the same registry value.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{
    ///     ChatProviderPort, ChatRequest, ChatResponse, ProviderFuture, ProviderRegistry,
    /// };
    /// use opencode_domain::ProviderId;
    /// use std::sync::Arc;
    ///
    /// struct StubProvider;
    ///
    /// impl ChatProviderPort for StubProvider {
    ///     fn send_chat<'a>(&'a self, _request: ChatRequest) -> ProviderFuture<'a, ChatResponse> {
    ///         Box::pin(async { Ok(ChatResponse::new("ok", None)) })
    ///     }
    /// }
    ///
    /// let mut registry = ProviderRegistry::default();
    /// let previous = registry.register(ProviderId::try_from("openai")?, Arc::new(StubProvider));
    /// assert!(previous.is_none());
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    pub fn register(
        &mut self,
        provider_id: ProviderId,
        provider: Arc<dyn ChatProviderPort>,
    ) -> Option<Arc<dyn ChatProviderPort>> {
        self.providers.insert(provider_id, provider)
    }

    /// Sends a chat request through the provider selected on the request.
    ///
    /// # Errors
    ///
    /// Returns [`ProviderError::ProviderNotFound`] when no adapter is
    /// registered for the requested provider. Otherwise returns the selected
    /// provider adapter's error.
    ///
    /// # Examples
    ///
    /// ```
    /// use opencode_application::{
    ///     ChatMessage, ChatProviderPort, ChatRequest, ChatResponse, ChatRole, ProviderFuture,
    ///     ProviderRegistry,
    /// };
    /// use opencode_domain::{ModelId, ProviderId, SessionId};
    /// use std::sync::Arc;
    ///
    /// struct StubProvider;
    ///
    /// impl ChatProviderPort for StubProvider {
    ///     fn send_chat<'a>(&'a self, _request: ChatRequest) -> ProviderFuture<'a, ChatResponse> {
    ///         Box::pin(async { Ok(ChatResponse::new("ok", None)) })
    ///     }
    /// }
    ///
    /// let mut registry = ProviderRegistry::default();
    /// registry.register(ProviderId::try_from("openai")?, Arc::new(StubProvider));
    /// let request = ChatRequest::new(
    ///     SessionId::try_from("ses_01")?,
    ///     ProviderId::try_from("openai")?,
    ///     ModelId::try_from("gpt-5")?,
    ///     vec![ChatMessage::new(ChatRole::User, "hello")?],
    /// )?;
    /// let _future = registry.send_chat(request);
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    pub fn send_chat(&self, request: ChatRequest) -> ProviderFuture<'_, ChatResponse> {
        let provider_id = request.provider_id().clone();
        let provider = self.providers.get(&provider_id).cloned();

        Box::pin(async move {
            let Some(provider) = provider else {
                return Err(ProviderError::provider_not_found(provider_id.as_str()));
            };

            provider.send_chat(request).await
        })
    }
}

#[cfg(test)]
mod tests {
    use super::ProviderRegistry;
    use crate::{
        ChatMessage, ChatProviderPort, ChatRequest, ChatResponse, ChatRole, FinishReason,
        ProviderError, ProviderFuture,
    };
    use opencode_domain::{ModelId, ProviderId, SessionId};
    use std::error::Error;
    use std::sync::Arc;
    use std::task::{Context, Poll, Wake, Waker};

    struct FixedProvider {
        response: ChatResponse,
    }

    impl FixedProvider {
        fn new(response: ChatResponse) -> Self {
            Self { response }
        }
    }

    /// Test provider that returns a fixed response without touching I/O.
    impl ChatProviderPort for FixedProvider {
        fn send_chat<'a>(&'a self, _request: ChatRequest) -> ProviderFuture<'a, ChatResponse> {
            Box::pin(async { Ok(self.response.clone()) })
        }
    }

    struct NoopWake;

    /// Waker used for polling immediately-ready test futures.
    impl Wake for NoopWake {
        fn wake(self: Arc<Self>) {}
    }

    #[test]
    fn registered_provider_response_returns_through_registry() -> Result<(), Box<dyn Error>> {
        // Tests ProviderRegistry::send_chat with a registered mock provider,
        // input ids built through domain constructors, and assertions on the
        // provider output because this is the M1 vertical path for CIT-0001.
        let mut registry = ProviderRegistry::default();
        registry.register(
            ProviderId::try_from("openai")?,
            Arc::new(FixedProvider::new(ChatResponse::new(
                "pong",
                Some(FinishReason::Stop),
            ))),
        );

        let response = poll_ready(registry.send_chat(chat_request("openai")?))?;

        assert_eq!(response.output(), "pong");
        assert_eq!(response.finish_reason(), Some(FinishReason::Stop));
        Ok(())
    }

    #[test]
    fn unregistered_provider_returns_not_found() -> Result<(), Box<dyn Error>> {
        // Tests ProviderRegistry::send_chat with no matching provider,
        // input ids built through domain constructors, and assertion on the
        // semantic error because missing providers are expected user failures.
        let registry = ProviderRegistry::default();

        let result = poll_ready(registry.send_chat(chat_request("anthropic")?));

        assert!(matches!(
            result,
            Err(ProviderError::ProviderNotFound { provider }) if provider.as_ref() == "anthropic"
        ));
        Ok(())
    }

    #[test]
    fn register_replaces_existing_provider_for_same_id() -> Result<(), Box<dyn Error>> {
        // Tests ProviderRegistry::register replacement semantics with two mock
        // providers for the same id and assertion on the second response
        // because config reloads must be able to swap adapters safely.
        let mut registry = ProviderRegistry::default();
        let first = Arc::new(FixedProvider::new(ChatResponse::new(
            "first",
            Some(FinishReason::Stop),
        )));
        let second = Arc::new(FixedProvider::new(ChatResponse::new(
            "second",
            Some(FinishReason::Stop),
        )));
        let provider_id = ProviderId::try_from("openai")?;

        let previous = registry.register(provider_id.clone(), first);
        let replaced = registry.register(provider_id, second);
        let response = poll_ready(registry.send_chat(chat_request("openai")?))?;

        assert!(previous.is_none());
        assert!(replaced.is_some());
        assert_eq!(response.output(), "second");
        Ok(())
    }

    fn chat_request(provider_id: &str) -> Result<ChatRequest, Box<dyn Error>> {
        ChatRequest::new(
            SessionId::try_from("ses_01")?,
            ProviderId::try_from(provider_id)?,
            ModelId::try_from("gpt-5")?,
            vec![ChatMessage::new(ChatRole::User, "hello")?],
        )
        .map_err(Into::into)
    }

    fn poll_ready<T>(mut future: ProviderFuture<'_, T>) -> Result<T, ProviderError> {
        let waker = Waker::from(Arc::new(NoopWake));
        let mut context = Context::from_waker(&waker);

        match future.as_mut().poll(&mut context) {
            Poll::Ready(result) => result,
            Poll::Pending => Err(ProviderError::transport("test future remained pending")),
        }
    }
}
