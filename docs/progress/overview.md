# 进度总览

## M0 文档和协议基线

| 功能 | 状态 | 文档 |
|---|---|---|
| opencode Rust + WebJS desktop 迁移 | M1 skeleton 已闭环 | [功能现状](opencode-rust-webjs-port/功能现状.md) |
| account-auth-and-billing | 未开始 | [功能现状](account-auth-and-billing/功能现状.md) |
| agent-prompt-and-compaction | 未开始 | [功能现状](agent-prompt-and-compaction/功能现状.md) |
| cloud-console-stats-enterprise | 未开始 | [功能现状](cloud-console-stats-enterprise/功能现状.md) |
| configuration-and-repo-assets | 未开始 | [功能现状](configuration-and-repo-assets/功能现状.md) |
| deployment-release-and-install | 未开始 | [功能现状](deployment-release-and-install/功能现状.md) |
| desktop-webjs-and-web-ui | M1 sidecar contract 已闭环 | [功能现状](desktop-webjs-and-web-ui/功能现状.md) |
| docs-web-localization-and-identity | 未开始 | [功能现状](docs-web-localization-and-identity/功能现状.md) |
| external-integrations-github-slack-editors | 未开始 | [功能现状](external-integrations-github-slack-editors/功能现状.md) |
| interface-cli-http-sdk-acp | M1 HTTP/OpenAPI/SDK seam 已闭环 | [功能现状](interface-cli-http-sdk-acp/功能现状.md) |
| lsp-pty-and-ide | 未开始 | [功能现状](lsp-pty-and-ide/功能现状.md) |
| mcp-plugin-and-skills | 未开始 | [功能现状](mcp-plugin-and-skills/功能现状.md) |
| observability-background-and-event-bus | 未开始 | [功能现状](observability-background-and-event-bus/功能现状.md) |
| project-workspace-vcs-file | 未开始 | [功能现状](project-workspace-vcs-file/功能现状.md) |
| provider-model-and-auth | M1 provider application seam 已闭环 | [功能现状](provider-model-and-auth/功能现状.md) |
| session-lifecycle-and-messages | 未开始 | [功能现状](session-lifecycle-and-messages/功能现状.md) |
| shared-libraries-protocol-and-recorder | 未开始 | [功能现状](shared-libraries-protocol-and-recorder/功能现状.md) |
| storage-sync-and-share | 未开始 | [功能现状](storage-sync-and-share/功能现状.md) |
| tool-execution-and-permission | 未开始 | [功能现状](tool-execution-and-permission/功能现状.md) |

## 当前最高风险

1. 真实 agent/provider/tool/session 主链路尚未实现，M1 只完成 skeleton/seam。
2. OpenAPI/SDK/CLI 自动化 diff 尚未实现，`interface-cli-http-sdk-acp` 目前只覆盖 health/openapi 两个 M1 operation。
3. JS plugin/TUI plugin 隔离运行时未定，阻塞 `mcp-plugin-and-skills` 与完整 Desktop prototype。
