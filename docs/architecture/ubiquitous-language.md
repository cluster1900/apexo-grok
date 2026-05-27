# 通用语言

| 术语 | 定义 | 值对象/聚合 |
|---|---|---|
| Workspace Root | 用户授权的工作区根目录，所有文件操作必须在其内或显式 external directory 内。 | `WorkspaceRoot` |
| Project | 一个被 opencode 打开的代码项目，关联 VCS、worktree、初始化状态与 workspace。 | `Project` 聚合 |
| Workspace | 项目下的工作空间，可为本地目录、worktree 或外部 adapter 返回的 workspace。 | `Workspace` 实体 |
| Session | 一次 agent 对话/任务执行，包含消息、part、工具调用、todo、summary、revert/share 状态。 | `Session` 聚合 |
| Message | 用户或 assistant 的消息。assistant message 可包含 tool call、reasoning、file/subtask part。 | `Message` 实体 |
| Part | 消息中的文本、文件、tool、step、reasoning、agent/subtask 等片段。 | `Part` 实体 |
| Agent | 模型、prompt、工具和权限组合，分 primary/subagent/specialized。 | `AgentProfile` 值对象 |
| Tool | LLM 可调用的能力，具备 id、description、input schema、permission、timeout、output schema。 | `ToolDefinition` |
| Permission Request | 工具或子 agent 执行前发起的审批请求。 | `PermissionWorkflow` 聚合 |
| Provider | LLM 服务提供者，包含 auth、model catalog、请求 adapter。 | `ProviderCatalog` 聚合 |
| Model | Provider 下的模型，包含能力、上下文限制、成本、状态、variant。 | `ModelProfile` 值对象 |
| MCP Server | Model Context Protocol server，分 local/remote，可能需要 OAuth。 | `MCPServerConnection` 聚合 |
| Plugin | 外部扩展，提供 hook、tool、provider、TUI slot/route/keymap。 | `PluginRuntime` 聚合 |
| PTY Session | 可通过 WebSocket 连接的伪终端会话。 | `PtySession` 聚合 |
| Sync Event | workspace/session 跨端同步的版本化事件。 | `SyncAggregateHistory` 聚合 |
| Share | session 分享状态，包含 share id、secret、url 与远端同步。 | `SharedSession` 聚合 |
| Release Artifact | 可安装或发布的 CLI、desktop、SDK、extension、container、Nix package。 | `ReleaseArtifact` 值对象 |
| Platform Target | OS、arch、libc、CPU baseline、desktop runtime 的平台组合。 | `PlatformTarget` 值对象 |
| External Integration | GitHub Action、Slack、VS Code、Zed、ACP 等外部入口。 | `IntegrationInstallation` 聚合 |
| External Reference | 外部平台中的 issue、PR、comment、file selection、line range、thread。 | `ExternalReference` 值对象 |
| Cloud Account | Console/Stats/Enterprise 侧的账号、workspace、API key、billing 状态。 | `CloudAccount` 聚合 |
| Usage Report | provider/model/token/cost/latency/geo 等统计事实。 | `UsageReport` 实体 |
| Prompt Asset | 版本化 prompt、agent、command、skill、tool、theme 或 glossary 资产。 | `PromptAsset` 聚合 |
| Repo-local Config | workspace 内 `.opencode` 配置和资产集合。 | `RepoLocalConfig` 聚合 |
| Shared Schema | 跨 CLI/HTTP/SDK/Desktop/Cloud 复用的 schema contract。 | `SharedSchema` 值对象 |
| Recorded Exchange | HTTP/WS 录制回放 cassette，含匹配和脱敏规则。 | `RecordedExchange` 聚合 |
