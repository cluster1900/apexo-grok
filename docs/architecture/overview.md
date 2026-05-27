# opencode-rs 架构总览

## 1. 目标

`opencode-rs` 将上游 `/Users/hawk_wu/Desktop/opencode` 的 coding agent 迁移为 Rust core + WebJS desktop。目标是协议兼容、功能完整、DDD 分层明确，并保留 Web UI/Desktop/TUI/SDK/插件生态的可用入口。

## 2. 分层原则

| 层 | 职责 | Rust 规划 |
|---|---|---|
| `domain/` | 领域模型、不变量、值对象、领域事件；零 I/O、零 runtime 依赖。 | session、message、tool call、project、workspace、provider/model、permission、mcp、pty、share、sync event。 |
| `application/` | 用例编排、事务边界、跨聚合协调、事件发布订阅。 | prompt、tool execution、permission reply、provider auth、mcp connect、workspace sync、share、pty lifecycle。 |
| `infrastructure/` | SQLite、filesystem、git、shell、LSP、PTY、HTTP client、provider SDK、MCP transport、plugin runtime。 | 所有外部 I/O 经 port/adapter；命令执行必须参数化和审批。 |
| `interface/` | CLI/TUI/HTTP/SSE/WS/Desktop preload/JS SDK/OpenAPI。 | 对齐上游 CLI/HTTP/Tool/Desktop 协议，WebJS 通过 SDK 访问 Rust server。 |

依赖方向固定为 `interface -> application -> domain <- infrastructure`。`domain` 不引用 `tokio`、数据库、HTTP、文件系统、provider SDK。

## 3. 限界上下文

| 上下文 | 目录 | 覆盖功能 |
|---|---|---|
| Session & Agent | `session-and-agent/` | 会话、消息、part、agent、prompt、processor、summary、compaction、todo、revert、subagent。 |
| Tool Execution | `tool-execution/` | 内置 tool、插件 tool、shell/apply_patch/edit/read/write/grep/glob/task/webfetch/websearch/lsp/skill、权限与输出截断。 |
| Provider & Model | `provider-and-model/` | Provider catalog、模型能力/成本/状态、auth、OAuth、LLM streaming、model variant。 |
| Project & Workspace | `project-workspace/` | project 识别、workspace routing、git/VCS、worktree、file/search/watcher、LSP。 |
| Configuration | `configuration/` | config 合并、env、remote config、plugin origin、permission/tools 迁移、formatter/lsp/mcp/provider config。 |
| MCP & Plugin | `mcp-and-plugin/` | MCP local/remote/OAuth、resources/prompts/tools、plugin hooks、TUI/plugin SDK、workspace adapters。 |
| Interface CLI/HTTP | `interface-cli-http/` | yargs CLI 等价面、HTTP API、SSE、WS、OpenAPI/SDK 生成、auth/cors/workspace routing。 |
| Desktop WebJS | `desktop-webjs/` | Electron/WebJS shell、sidecar IPC、preload API、updater、native picker、clipboard、deeplink、Web UI。 |
| Storage & Sync | `storage-sync/` | SQLite schema、JSON migration、event store、projectors、share sync、global/session event bridge。 |
| Deployment & Distribution | `deployment-and-distribution/` | installer、Nix、CI workflow、release scripts、container images、dependency patches、artifact rollback。 |
| External Integrations | `external-integrations/` | GitHub Action、VS Code、Zed、Slack、ACP、SDK consumers 的外部命令和事件入口。 |
| Cloud Console & Stats | `cloud-console-stats/` | Console、Stats、Enterprise、Function、SST infra、share/usage/account/API key/billing。 |
| Prompt Assets & Repo Config | `prompt-assets-and-repo-config/` | `.opencode` agent/command/skill/tool/theme/glossary、prompt 版本、repo-local asset loader。 |
| Shared Libraries | `shared-libraries/` | `packages/core`、`packages/llm`、`http-recorder`、script/codegen、v2 specs 的共享 schema/protocol。 |

## 4. 协议基线

本架构的外部契约以调研附件为规划基线：

- HTTP 入参/出参：`docs/research/opencode-upstream-analysis/附件/http-api-inventory.generated.md`。
- OpenAPI 字段级 schema/ref：`docs/research/opencode-upstream-analysis/附件/openapi-schema-inventory.generated.md`。
- CLI 入参/出参：`docs/research/opencode-upstream-analysis/附件/cli-command-inventory.generated.md`。
- Tool 入参/出参：`docs/research/opencode-upstream-analysis/附件/tool-inventory.generated.md`。
- SQLite 表：`docs/research/opencode-upstream-analysis/附件/storage-schema.generated.md`。
- WebJS/Desktop 包入口：`docs/research/opencode-upstream-analysis/附件/package-inventory.generated.md`。
- 全仓缺口修正：`docs/research/opencode-upstream-analysis/附件/repository-scope-gap-analysis_2026-05-27.md`。

字段级 schema 在实现阶段由 Rust 类型、`serde`、OpenAPI JSON Schema 和 JS SDK 生成物共同固化；不允许手写与清单冲突的接口。

## 5. 安全模型

- workspace root、directory、worktree、external directory 均建模为值对象；路径规范化后必须落在允许边界内。
- shell/tool/file/git/pty/mcp/plugin 执行经 permission workflow；危险操作二次确认。
- 外部内容进入模型前必须截断并包裹 `<untrusted_input>`。
- secret 只来自 env/secret manager，不进入日志、prompt、配置文件和命令行。
- trace 贯穿 CLI/Desktop/HTTP -> application -> provider/tool/mcp。

## 6. 迁移阶段

1. M0：文档和协议基线完成，生成清单与上游源码对齐。
2. M1：Rust server skeleton + OpenAPI/SDK 生成 + WebJS desktop sidecar 打通。
3. M2：session/agent/tool/provider/config/project/storage 主路径可用。
4. M3：MCP/plugin/PTY/LSP/share/sync/desktop native 能力补齐。
5. M4：部署分发、外部集成、cloud/share/stats、repo-local prompt/asset、shared library/codegen 兼容性补齐。
6. M5：CLI/TUI/Web UI/外围集成兼容性测试、E2E、Agent Eval 达到门禁。

## 7. 未决问题

- 上游 `public.ts` 的 OpenAPI 兼容修正需要逐条转为 Rust OpenAPI patch 规则。
- Provider AI SDK 的 Rust 等价 adapter 选型需单独调研并记录 crate 维护性/许可证/CVE。
- TUI 是 Rust 原生重写还是保留 JS TUI 过渡，需要在人类确认后进入开发。
