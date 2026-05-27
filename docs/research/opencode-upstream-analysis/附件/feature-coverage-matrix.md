# 功能覆盖矩阵

- 生成时间：2026-05-27
- 来源：上游源码目录、三份子 agent 核对结果、HTTP/CLI/Tool/OpenAPI/Package 清单。

## Core agent

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| Session lifecycle | `packages/opencode/src/session/session.ts` | Session & Agent | create/list/get/update/delete/fork/children/archive/share/revert 全覆盖。 |
| Message/Part | `session/message-v2.ts` | Session & Agent | user/assistant/text/reasoning/file/tool/step/subtask/agent part 状态机全覆盖。 |
| Prompt/Processor | `session/prompt.ts`、`processor.ts` | Session & Agent | prompt、command、shell、async、stream、tool loop、doom loop、abort。 |
| Agent profiles | `agent/agent.ts` | Session & Agent | build/plan/general/explore/scout/title/summary/compaction/custom agent。 |
| Summary/Compaction | `session/summary.ts`、`compaction.ts` | Session & Agent | auto compaction、tail turns、reserved token、summary message。 |
| Todo | `session/todo.ts`、`tool/todo.ts` | Session & Agent / Tool | todo read/write、priority/status/order。 |
| Tool registry | `tool/registry.ts` | Tool Execution | 内置、MCP、plugin、自定义目录 tool、model filter。 |
| Shell tool | `tool/shell.ts` | Tool Execution | bash/pwsh/powershell/cmd、permission arity、timeout、output truncation。 |
| File edit tools | `tool/read/write/edit/apply_patch.ts` | Tool Execution / Project | path guard、snapshot、patch grammar、binary/image handling。 |
| Search tools | `tool/glob.ts`、`grep.ts`、`webfetch.ts`、`websearch.ts` | Tool Execution | glob/grep/web fetch/search 参数和 truncation。 |
| Task/subagent | `tool/task.ts` | Session & Agent / Tool | foreground/background subagent、permission、resume task_id。 |
| Provider catalog | `provider/provider.ts` | Provider & Model | models.dev/config/env/auth/plugin 合并、filter、status、variant。 |
| Provider auth | `provider/auth.ts` | Provider & Model | API key、OAuth authorize/callback/logout、error shape。 |
| LLM request | `session/llm/*` | Provider & Model | AI SDK/native runtime、streaming、timeouts、usage/cost。 |
| Config | `config/config.ts` | Configuration | JSONC、remote/managed/env/CLI 合并、legacy migration。 |
| Permission | `permission/index.ts` | Tool Execution / Session | ruleset、pending、reply、ask/allow/deny、doom_loop。 |
| MCP | `mcp/index.ts` | MCP & Plugin | local/remote、StreamableHTTP/SSE fallback、OAuth、tools/resources/prompts。 |
| Plugin | `plugin/index.ts`、`packages/plugin/src` | MCP & Plugin | hook、tool、provider、auth、permission、TUI extension、dispose。 |
| Project | `project/project.ts` | Project & Workspace | project id/worktree/vcs/icon/initGit/sandboxes/commands。 |
| Workspace | `control-plane/workspace.ts` | Project & Workspace | list/create/remove/status/sync/warp/adapters。 |
| VCS | `project/vcs.ts` | Project & Workspace | git status/diff/raw/apply、not-clean/non-git errors。 |
| File | `file/index.ts`、`file/watcher.ts` | Project & Workspace | list/content/status/find file/text/symbol/watcher。 |
| LSP | `lsp/lsp.ts` | Project & Workspace | diagnostics、symbols、hover、definition、references、status。 |
| PTY | `pty/index.ts` | Project & Workspace / Interface | shells/list/create/get/update/remove/connect-token/connect WS。 |
| Formatter/Image/Media | `format/*`、`image/*`、`util/media.ts`、`util/data-url.ts`、`audio.d.ts` | Project & Workspace / Provider & Model | formatter resolution、image normalize、media modality/mime mapping、audio module boundary。 |
| Storage | `storage/*`、`*.sql.ts` | Storage & Sync | SQLite schema、JSON migration、locks、not found。 |
| Sync | `sync/index.ts` | Storage & Sync | start/replay/steal/history、aggregate seq、projectors。 |
| Share | `share/session.ts`、`share-next.ts` | Storage & Sync / Session | manual/auto/disabled、remote create/sync/remove、secret/url。 |

## Interface and clients

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| CLI main | `packages/opencode/src/index.ts` | Interface CLI/HTTP | global flags、one-time migration、default TUI、error format。 |
| TUI | `cli/cmd/tui/*` | Interface CLI/HTTP / Desktop WebJS | session UI、dialogs、sidebar、plugins、diff viewer、notifications。 |
| Run command | `cli/cmd/run.ts` | Interface CLI/HTTP | streaming/json output、attach、interactive、permission/footer。 |
| Serve/Web/ACP | `cli/cmd/serve.ts`、`web.ts`、`acp.ts` | Interface CLI/HTTP | server lifecycle、Web UI open、ACP protocol。 |
| ACP-next | `acp-next/*` | Interface CLI/HTTP / External Integrations | protocolVersion、authMethods、session lifecycle、config options、directory snapshot、MCP server registration、message replay。 |
| HTTP API | `server/routes/instance/httpapi/*` | Interface CLI/HTTP | 131 source endpoints + 131 OpenAPI operations，包含 v2 source groups。 |
| SSE | `groups/event.ts`、`groups/global.ts` | Interface CLI/HTTP | `/event`、`/global/event`、reconnect/event schema。 |
| JS SDK | `packages/sdk/js/src` | Interface CLI/HTTP | generated SDK v2、directory/workspace rewrite、error interceptor。 |
| Desktop main | `packages/desktop/src/main` | Desktop WebJS | sidecar、updater、native API、deeplink、store、logging、cert/proxy。 |
| Desktop preload | `packages/desktop/src/preload` | Desktop WebJS | safe IPC API with typed request/response。 |
| Web app | `packages/app/src` | Desktop WebJS | sessions、prompt、permissions、settings、terminal、diff、file tree、global sync。 |
| UI package | `packages/ui` | Desktop WebJS | reusable components、markdown/diff/file viewer。 |

## Peripheral integrations

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| Console | `packages/console/*` | Interface/Provider adapter | auth/workspace/API key/billing/usage/share/docs proxy，按外围系统兼容。 |
| Stats | `packages/stats/*` | Observability/Interface adapter | ingest、Athena/lake、provider/model/geo stats。 |
| Slack | `packages/slack` | Interface adapter | SDK-driven bot，保持 HTTP/SDK contract。 |
| VS Code | `sdks/vscode/src/extension.ts` | Interface adapter | CLI + `/tui/append-prompt`，文件引用格式。 |
| GitHub Action | `github/index.ts`、`github/action.yml` | Interface adapter | `/opencode` comment trigger、serve+SDK、branch/PR/share。 |
| Web/docs | `packages/web` | Deployment/Docs adapter | docs/marketing/share page 可独立保留。 |
| Storybook | `packages/storybook` | UI validation | WebJS UI 组件验证。 |
| Effect SQLite package | `packages/effect-drizzle-sqlite` | Legacy support only | Rust 迁移后不保留实现，只保留数据兼容语义。 |

## Repository and productization

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| Installer | `install` | Deployment & Distribution | `--version`、`--binary`、`--no-modify-path`、OS/arch/libc/AVX2 baseline、local binary、PATH 修改兼容。 |
| Root workspace scripts | `package.json`、`turbo.json`、`bunfig.toml` | Deployment & Distribution | dev/typecheck/lint/publish/generate/stats 脚本语义纳入 Rust/CI 迁移计划。 |
| Dependency patches | `patches/*` | Deployment & Distribution / Shared Libraries | 每个 patch 都要确认 Rust/WebJS 迁移后是否仍需保留或替代。 |
| Nix packaging | `flake.nix`、`nix/*` | Deployment & Distribution | CLI、desktop、node_modules derivation 和 hash updater 保留等价发布路径。 |
| CI workflows | `.github/workflows/*`、`.github/actions/*` | Deployment & Distribution / Testing | beta/publish/deploy/test/typecheck/nix/docs/stats/containers/extension 发布 workflow 有等价 CI 门禁。 |
| CI containers | `packages/containers/*` | Deployment & Distribution | base/bun-node/rust/tauri-linux/publish 镜像或 Rust 等价构建环境。 |
| Release scripts | `script/*`、`github/script/*`、`sdks/vscode/script/*` | Deployment & Distribution | changelog/version/publish/sign/sync-zed/duplicate-pr 等脚本能力归档并决定保留/重写。 |
| Identity assets | `packages/identity/*` | Deployment & Distribution / Desktop WebJS | 桌面、docs、extension、release 包共享 logo/icon，避免迁移后资源缺失。 |
| Specs | `specs/*` | Shared Libraries / Architecture input | v2 project/session/provider/model/instructions/todo 作为 Rust domain 建模输入。 |
| Performance baseline | `perf/test-suite.md`、`STATS.md` | Testing / Observability | 纳入性能/eval 基线，不只做功能 smoke。 |

## Shared libraries and protocol kernel

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| Core v2 package | `packages/core/*` | Shared Libraries | schema、typed errors、events、plugin hooks、provider/account/agent/catalog 容器作为 Rust domain/shared kernel 输入。 |
| LLM package | `packages/llm/*` | Shared Libraries / Provider & Model | provider/protocol/route/tool-runtime/cache/auth/options/recorded tests 全覆盖，不只等价 AI SDK 调用。 |
| HTTP recorder | `packages/http-recorder/*` | Shared Libraries / Testing | cassette、matching、redaction、websocket record/replay 作为 provider/HTTP 测试基础设施。 |
| Script package | `packages/script` | Shared Libraries / Deployment | codegen/publish/version/stats 工具语义统一迁移，不散落在业务代码中。 |
| Effect SQLite legacy | `packages/effect-drizzle-sqlite` | Shared Libraries / Storage & Sync | 保留数据语义和迁移兼容，不复制 Effect/Drizzle runtime。 |
| Runtime utilities | `packages/opencode/src/util/*`、`effect/*`、`env/*`、`id/*` | Shared Libraries / Observability | BOM/wildcard/process/timeout/media/token、runtime flags、instance state、typed ID prefix 与 env snapshot。 |

## Cloud and hosted products

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| Infra | `infra/*`、`sst.config.ts` | Cloud Console & Stats / Deployment | console/enterprise/lake/monitoring/secret/stage/stats 资源边界和 secret/stage 策略。 |
| Function API | `packages/function/*` | Cloud Console & Stats / External Integrations | GitHub App/JWT/Worker API，不泄漏云端 DTO 到 core domain。 |
| Enterprise | `packages/enterprise/*` | Cloud Console & Stats | share/storage/routes/cloudflare build，与本地 share policy 保持一致。 |
| Console | `packages/console/*` | Cloud Console & Stats | auth/workspace/API key/billing/usage/share/docs proxy。 |
| Stats | `packages/stats/*` | Cloud Console & Stats / Observability | ingest/lake/provider/model/geo stats，usage/cost 可追溯。 |

## Repo-local prompt and configuration assets

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| Repo config | `.opencode/opencode.jsonc`、`.opencode/tui.json` | Prompt Assets & Repo Config / Configuration | repo-local config 与全局 config 合并，路径必须经 workspace guard。 |
| Custom agents | `.opencode/agent/*.md` | Prompt Assets & Repo Config / Session & Agent | agent profile、prompt 版本、模型档位和权限策略可追踪。 |
| Custom commands | `.opencode/command/*.md` | Prompt Assets & Repo Config / Interface CLI/HTTP | slash/custom command 转 session prompt，外部内容按不可信输入处理。 |
| Skills | `.opencode/skills/*/SKILL.md` | Prompt Assets & Repo Config / MCP & Plugin | skill loader、引用文件、版本和 Prompt 回归。 |
| Custom tools | `.opencode/tool/*.ts` | Prompt Assets & Repo Config / Tool Execution | repo-local tool 默认 ask，隔离执行，schema 重校验。 |
| Themes/plugins | `.opencode/themes/*`、`.opencode/plugins/*` | Prompt Assets & Repo Config / Desktop WebJS | TUI/WebJS theme/plugin smoke 保留。 |
| Glossary/locales | `.opencode/glossary/*`、`README.*.md`、`packages/docs/*` | Prompt Assets & Repo Config / Deployment | docs locale/glossary 同步纳入 docs pipeline。 |

## Editor and automation integrations expanded

| 功能 | 上游入口 | 迁移上下文 | 迁移要求 |
|---|---|---|---|
| GitHub Action full flow | `github/*` | External Integrations | issue/PR/review comment、diff context、branch/PR/share、mock event、本地调试 env。 |
| VS Code extension full flow | `sdks/vscode/*` | External Integrations | commands/keybindings/terminal reuse/current selection/file reference/build/test/publish。 |
| Zed extension | `packages/extensions/zed/*`、`script/sync-zed.ts` | External Integrations | manifest/icon/sync workflow，CLI/SDK contract 保持。 |
| Docs site content | `packages/docs/*` | Deployment & Distribution / Prompt Assets | quickstart/settings/AI tools/images/logo 作为产品文档资产保留。 |
