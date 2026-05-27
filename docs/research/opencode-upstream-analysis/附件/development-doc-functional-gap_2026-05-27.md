# 开发文档功能拆分缺口复核 — 2026-05-27

## 1. 结论

上一版 `docs/development/opencode-rust-webjs-port/` 是迁移总方案，不是按功能拆分的开发设计。它可以回答“Rust + WebJS desktop 怎么整体迁”，但不能支持后续按 session、tool、provider、MCP、Desktop、外部集成、部署发布等功能分别开工、评审和验收。

`docs/development/README.md` 已明确要求“一个功能 = 一个子目录”。因此当前只有一个 `opencode-rust-webjs-port` 子目录是不符合开发文档结构要求的；这也是读起来感觉“没覆盖所有功能”的主要原因。

## 2. 上游功能入口重新归组

| 功能开发目录 | 上游入口 | 必须覆盖 |
|---|---|---|
| `session-lifecycle-and-messages` | `session/*`、`question/*`、`background/*` | session CRUD、message/part、prompt/run state、retry、structured output、question。 |
| `agent-prompt-and-compaction` | `agent/*`、`session/system.ts`、`summary.ts`、`compaction.ts`、`instruction.ts` | agent profile、subagent、system prompt、summary、compaction、reminders。 |
| `tool-execution-and-permission` | `tool/*`、`permission/*`、`shell/*`、`snapshot/*`、`patch/*` | built-in tools、permission rules、shell/apply_patch/edit/read/write/search/task/web、truncation。 |
| `provider-model-and-auth` | `provider/*`、`auth/*`、`account/*`、`packages/llm/*` | catalog、model status、auth/OAuth/API key、provider protocol、usage/cost。 |
| `configuration-and-repo-assets` | `config/*`、`.opencode/*`、`skill/*`、`command/*` | config merge、managed config、repo-local agent/command/skill/tool/theme/glossary。 |
| `mcp-plugin-and-skills` | `mcp/*`、`plugin/*`、`packages/plugin/*` | MCP transport/OAuth、plugin loader、hooks、custom providers/tools/TUI plugin、skill discovery。 |
| `project-workspace-vcs-file` | `project/*`、`control-plane/*`、`worktree/*`、`git/*`、`file/*`、`reference/*` | project/workspace/worktree、VCS、file tree/content/search/watcher、references。 |
| `lsp-pty-and-ide` | `lsp/*`、`pty/*`、`ide/*`、`format/*`、`image/*` | LSP lifecycle、diagnostics/symbols、PTY tickets/WS、IDE bridge、format/image helpers。 |
| `storage-sync-and-share` | `storage/*`、`sync/*`、`share/*`、`migration/*` | SQLite schema、JSON migration、event replay、share-next、migration progress。 |
| `interface-cli-http-sdk-acp` | `cli/*`、`server/*`、`acp/*`、`acp-next/*`、`packages/sdk/js/*` | CLI commands、HTTP/SSE/WS、OpenAPI/SDK、ACP。 |
| `desktop-webjs-and-web-ui` | `packages/desktop/*`、`packages/app/*`、`packages/ui/*`、`packages/storybook/*` | sidecar/preload/native APIs、Web app、UI components、terminal/diff/file/settings。 |
| `external-integrations-github-slack-editors` | `github/*`、`sdks/vscode/*`、`packages/extensions/zed/*`、`packages/slack/*` | GitHub Action、VS Code、Zed、Slack、event/comment/editor context。 |
| `cloud-console-stats-enterprise` | `packages/console/*`、`packages/stats/*`、`packages/enterprise/*`、`packages/function/*`、`infra/*` | account/API key/billing/usage/share/stats lake/function/enterprise share。 |
| `deployment-release-and-install` | `install`、`nix/*`、`.github/workflows/*`、`script/*`、`packages/containers/*`、`patches/*` | install、release、CI、Nix、containers、signing、dependency patches。 |
| `shared-libraries-protocol-and-recorder` | `packages/core/*`、`packages/llm/*`、`packages/http-recorder/*`、`specs/*` | v2 core schema、provider protocols、record/replay、codegen/spec parity。 |
| `observability-background-and-event-bus` | `bus/*`、`event-v2-bridge.ts`、`server/projectors.ts`、`effect/*` | events、projectors、runtime flags、background jobs、trace/metrics/logging。 |
| `account-auth-and-billing` | `account/*`、`auth/*`、`packages/console/core/*` | account state、provider/cloud auth、API key、billing/user identity。 |
| `docs-web-localization-and-identity` | `packages/docs/*`、`packages/web/*`、`README.*.md`、`packages/identity/*` | docs site、marketing/share pages、locales/glossary、brand assets。 |

## 3. 修正动作

- 保留 `opencode-rust-webjs-port` 作为迁移总方案，不再把它当作唯一开发设计。
- 新增上述 18 个功能目录，每个目录均落 `功能设计.md`、`接口设计.md`、`数据设计.md`、`测试矩阵.md`，作为后续实现 PR 的开发基线。
- 后续任何实现 PR 必须落到具体功能目录；只有跨全局计划才更新总方案。
