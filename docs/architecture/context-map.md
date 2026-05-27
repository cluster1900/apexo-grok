# 限界上下文图

## 上下文关系

```text
Desktop/WebJS ─┐
CLI/TUI ───────┼─> Interface CLI/HTTP ─> Application use cases
JS SDK ────────┘
External Integrations ────────┘
Cloud Console/Stats ──────────┘

Application use cases ─> Session & Agent ─> Tool Execution ─> Permission Workflow
                      ├> Provider & Model
                      ├> Project & Workspace
                      ├> MCP & Plugin
                      └> Storage & Sync

Prompt Assets & Repo Config ─> Session & Agent / Tool Execution / Configuration
Shared Libraries ────────────> Provider & Model / Interface CLI/HTTP / Storage & Sync
Deployment & Distribution ──> build, package, install, publish all interfaces

Infrastructure adapters:
SQLite, filesystem, git, shell, PTY, LSP, provider HTTP, MCP transports, plugin runtime,
GitHub/Slack/editor APIs, SST/cloud, Nix, Docker, release services
```

## 上下文通信

| 来源 | 目标 | 通信方式 | 说明 |
|---|---|---|---|
| Interface CLI/HTTP | Session & Agent | application use case | CLI/HTTP 只传 DTO，application 转值对象。 |
| Session & Agent | Tool Execution | domain service + application orchestration | tool call 由 session processor 调度，权限由 permission workflow 决定。 |
| Tool Execution | Project & Workspace | ACL port | 文件、git、workspace 路径经 ACL 校验，不泄漏外部 DTO。 |
| Tool Execution | MCP & Plugin | ACL port | MCP/plugin tool 统一包装成 tool def，权限不高于用户配置。 |
| Session & Agent | Provider & Model | provider port | LLM 请求/流式响应转为 message/part 领域事件。 |
| Storage & Sync | Session/Project/Workspace | event projector | event store 只发布版本化事件，订阅者幂等。 |
| Desktop/WebJS | Interface CLI/HTTP | HTTP/SSE/WS + preload IPC | Desktop 不直连 domain，sidecar server 是唯一业务入口。 |
| External Integrations | Interface CLI/HTTP | CLI/SDK/HTTP adapter | GitHub/Slack/VS Code/Zed/ACP 输入先转 DTO，再由 application 处理。 |
| Cloud Console/Stats | Storage & Sync / Interface CLI/HTTP | share/sync/usage port | 云端 share、usage、account 不直接改本地 domain。 |
| Prompt Assets & Repo Config | Configuration / Session & Agent / Tool Execution | asset loader + ACL | repo-local asset 通过 workspace guard 加载，Prompt 版本化。 |
| Shared Libraries | 各 runtime 上下文 | shared kernel / generated schema | 只提供 schema/protocol/recording/codegen，不持有产品流程。 |
| Deployment & Distribution | 全部 interface | build artifact contract | 发布物只打包已声明 interface，不绕过测试和配置规则。 |

## 反腐层

- Provider API、MCP SDK、plugin JS API、Electron IPC、GitHub/Slack/VS Code/Zed/Cloud DTO 均在 infrastructure/interface 转换。
- Domain 中禁止出现 OpenAPI DTO、Electron 类型、AI SDK 类型、Hono/Effect HTTP 类型。
