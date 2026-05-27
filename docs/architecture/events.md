# 领域事件登记

## 事件约定

- 命名用过去式或事实状态：`session.created`、`message.updated`、`pty.exited`。
- 每个事件包含 `schema_version`、`trace_id`、`aggregate_id`、`occurred_at`。
- application 订阅者必须幂等；event store 使用 aggregate seq 防止乱序回放。

## 事件清单

| 事件 | 聚合 | 载荷摘要 | 来源证据 |
|---|---|---|---|
| `session.created` | Session | session info、project/workspace、parent、model/agent。 | `packages/opencode/src/session/projectors.ts`、`session/session.ts` |
| `session.updated` | Session | title、time、permission、summary、revert/share/cost/tokens。 | `session/session.ts` |
| `session.deleted` | Session | sessionID，递归 child 删除。 | `session/session.ts` |
| `session.status` | Session | idle/busy/retry/error 状态。 | `session/status.ts` |
| `message.updated` | Message | user/assistant message info。 | `session/message-v2.ts` |
| `message.removed` | Message | sessionID、messageID。 | `session/message-v2.ts` |
| `message.part.updated` | Part | part full state。 | `session/message-v2.ts` |
| `message.part.delta` | Part | streaming text/reasoning/tool delta。 | `session/processor.ts` |
| `permission.asked` | PermissionWorkflow | permission id、session、tool、patterns、metadata。 | `permission/index.ts` |
| `permission.replied` | PermissionWorkflow | request id、allow/deny、message。 | `permission/index.ts` |
| `question.asked` | QuestionWorkflow | structured user question。 | `question/index.ts` |
| `question.replied` | QuestionWorkflow | selected/freeform answer。 | `question/index.ts` |
| `question.rejected` | QuestionWorkflow | rejected pending question。 | `question/index.ts` |
| `file.edited` | Project/Workspace | path、diff/snapshot metadata。 | `file/index.ts`、`snapshot` |
| `file.watcher.updated` | Project/Workspace | changed paths。 | `file/watcher.ts` |
| `lsp.updated` | LSP | server/status/diagnostic path。 | `lsp/lsp.ts` |
| `pty.created` | PtySession | pty info。 | `pty/index.ts` |
| `pty.updated` | PtySession | title/cwd/size/cursor。 | `pty/index.ts` |
| `pty.exited` | PtySession | exit status。 | `pty/index.ts` |
| `pty.deleted` | PtySession | ptyID。 | `pty/index.ts` |
| `project.updated` | Project | project info/icon/init/worktree。 | `project/project.ts` |
| `mcp.updated` | MCPServerConnection | status/tools/resources/auth。 | `mcp/index.ts` |
| `sync.event.appended` | SyncAggregateHistory | aggregate id、seq、type、data。 | `sync/index.ts` |
| `release.artifact.published` | ReleaseArtifact | artifact id、version、platform、checksum、publisher。 | `install`、`.github/workflows/publish.yml`、`script/publish.ts` |
| `integration.event.received` | IntegrationInstallation | platform、actor、external reference、command、dedupe key。 | `github/index.ts`、`sdks/vscode/src/extension.ts` |
| `integration.reply.sent` | IntegrationInstallation | platform、external reference、reply id、share url。 | `github/index.ts`、`packages/slack` |
| `cloud.usage.ingested` | UsageReport | provider、model、tokens、cost、latency、trace/session。 | `packages/stats/*`、`infra/stats.ts` |
| `cloud.share.published` | SharedSessionView | session、share id、url、policy、schema version。 | `share-next.ts`、`packages/enterprise/*` |
| `prompt.asset.loaded` | PromptAsset | asset type、path、version/hash、workspace。 | `.opencode/*` |
| `shared.schema.generated` | SharedSchema | schema name、version、source、hash。 | `packages/core/*`、`packages/llm/*`、`script/generate.ts` |
| `http.exchange.recorded` | RecordedExchange | cassette id、request match key、redaction status。 | `packages/http-recorder/*` |

## 未决问题

- 需要在实现阶段从上游 `BusEvent`/`SyncEvent` registry 生成完整 JSON Schema，并与 JS SDK SSE 类型对齐。
