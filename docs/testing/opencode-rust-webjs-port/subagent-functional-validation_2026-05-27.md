# Sub-agent 功能层文档验证报告 — 2026-05-27

## 1. 验证方式

本轮使用三个只读 sub-agent 从不同功能面核对 `/Users/hawk_wu/Desktop/opencode` 与 `docs/development` 的一致性：

| Agent | 范围 | 结论 |
|---|---|---|
| Wegener | core runtime：session、agent、tool、provider、config、MCP、project、LSP/PTY、storage、CLI/HTTP/ACP | 功能目录已覆盖，但原子文档仍偏摘要；指出 question 事件名、permission reply、MessageV2 part union、HTTP/CLI/SQLite 等 contract 级缺口。 |
| Plato | Desktop/WebJS/UI：desktop、app、ui、storybook、terminal、settings、file tree、diff、permission、provider dialogs、i18n | 目录级覆盖存在，但 preload API、IPC/sidecar、WebJS store/cache、terminal WS、UI 状态机和可执行测试不足。 |
| Huygens | ecosystem/cloud/deployment/docs：install、Nix、CI、GitHub Action、Slack、VS Code、Zed、Console、Stats、Enterprise、docs/web/identity、`.opencode` | 功能设计覆盖存在，但部署、外部集成、云端、docs/web、shared library 需要接口/数据/测试级文档。 |

## 2. 已修复问题

- `docs/development` 已从 1 个总方案目录扩展为 18 个功能目录 + 1 个总方案目录。
- 18 个功能目录均已补齐 `功能设计.md`、`接口设计.md`、`数据设计.md`、`测试矩阵.md`。
- 修正 question 事件名：使用 `question.asked`、`question.replied`、`question.rejected`，不使用旧的 answered 事件名。
- `tool-execution-and-permission/接口设计.md` 已补 18 个内置 tool 的字段表，并修正 permission reply 为 `once/always/reject`。
- `interface-cli-http-sdk-acp/接口设计.md` 已下沉 HTTP group/CLI command/server middleware/ACP contract。
- `storage-sync-and-share/数据设计.md` 已下沉 SQLite 表字段基线。
- `desktop-webjs-and-web-ui` 已补 preload/ElectronAPI、IPC/sidecar、WebJS state key、可执行 UI 用例。
- `deployment-release-and-install` 已补 installer、platform target、Nix、release、CI/container/patch 用例。
- `external-integrations`、`cloud-console-stats`、`shared-libraries`、`docs-web-localization` 已补 sub-agent 指出的具体 contract。

## 3. 复核结论

2026-05-27 复核结果：

| Agent | 复核结果 |
|---|---|
| Wegener | 初次复核发现 `tool-execution-and-permission/接口设计.md` 开头仍保留旧的 permission reply 口径；已修正为 `once/always/reject` 后再次复核，阻塞级缺口为无。 |
| Plato | Desktop/WebJS/UI 范围无阻塞级缺口。 |
| Huygens | ecosystem/cloud/deployment/docs 范围无阻塞级缺口。 |

## 4. 用户补充缺口回补

2026-05-27 追加按功能设计文档做字段级回补，覆盖用户指出的 14 类缺口：

| 范围 | 已回补到 |
|---|---|
| Session lifecycle | `SessionStatus` idle/busy/retry、retry action、overflow/usable 公式、session slug/version/path、fork title、doom loop 阈值、revert/unrevert/cleanup。 |
| Agent/prompt/compaction | 8 个内置 agent、`Agent.generate()`、per-model system prompt selector、环境 context、reminders、compaction 常量、experimental scout。 |
| Tool/permission | 18 个 tool 清单、shell arity、external directory、truncation 常量、snapshot/checkpoint、permission reply/always patterns、MCP websearch、plan_exit、patch grammar、BOM、wildcard。 |
| Provider/config/MCP/plugin | retry 常量、context overflow 不重试、Free/Go usage action、model variant、AI SDK/native runtime、GitLab provider、plugin provider merge、remote config、ConfigVariable、legacy migration、console/env、plugin install、skill 引用文件、MCP OAuth、MCP prompt command。 |
| Project/LSP/storage/interface/desktop/observability/account/shared | sandboxes/start/icon/routing/ignore/protected/ripgrep/watcher/reference、formatter/image/audio/PTY/LSP download、migration/sync steal/share-next/SQLite adapter、CLI/run/server/ACP-next、sidecar/updater/deeplink/cert/proxy/preload IPC、Bus/GlobalBus/EventV2Bridge/RuntimeFlags、account repo/url、ID strategy。 |

回补位置全部在对应 `docs/development/<功能>/功能设计.md`，避免只在验证报告里登记而不影响开发入口。

## 5. 追加 sub-agent 复核

2026-05-27 追加三名 sub-agent 做精细复核：

| Agent | 范围 | 发现 | 处理 |
|---|---|---|---|
| Pauli | session、agent、tool、provider、config | 阻塞缺口无；建议补 `plan_enter`/`plan_exit` 并列说明和 agent permission default 矩阵。 | 已补到 `tool-execution-and-permission/功能设计.md` 与 `agent-prompt-and-compaction/功能设计.md`。 |
| Feynman | MCP/plugin、project/file、LSP/PTY、storage、interface、desktop | 发现 CLI 子命令清单、preload channel schema、formatter resolution order 仍偏粗。 | 已补 CLI 顶层/debug/run/TUI 表、preload channel contract 表、formatter resolution order 表。 |
| Averroes | observability、account、Env/Patch/BOM/Wildcard、shared ID | 阻塞缺口无；建议补完整 ID prefix map，避免 `prt_` 等 wire prefix 漏实现。 | 已补到 `shared-libraries-protocol-and-recorder/功能设计.md`。 |

三名 sub-agent 对补丁做二次只读复查后均返回“无”。

## 6. 用户第二批补充缺口回补

2026-05-27 继续按用户补充的 10 类缺口做功能设计文档回补：

| 范围 | 已回补到 |
|---|---|
| Session lifecycle | `StructuredOutputTool`、`StructuredOutputError`、`PromptInput` 全字段、`noReply`、`format`、`system`、`time.compacting`、`time.archived` legacy 负值兼容、`SessionPrompt.shell()`、`shell.env`、`SessionPrompt.command()` 模板替换。 |
| Agent / prompt | `Instruction` 服务、`AGENTS.md` / `CLAUDE.md` / `CONTEXT.md`、remote instruction、loaded claim 去重、`Agent.Info.steps` loop 控制、`prompt/max-steps.txt` 注入。 |
| Tool / provider / config | `DynamicDescription`、`InvalidArgumentsError` self-repair、provider/model/agent tool filter、custom directory tools、`wrapSSE()` chunk timeout、Copilot Responses API 路由、`sdkKey()`、`sanitizeSurrogates()`、`ConfigMarkdown`、gray-matter fallback。 |
| Workspace / runtime / CLI / storage / shared | workspace adapter runtime、`ConnectionStatus`、`InstanceState`、`EffectBridge`、`Runner`、CLI bootstrap、Installation 服务、Provider Transform、`SessionMessageTable` / `projectors-next` 双 projection。 |

回补位置仍全部落到对应 `docs/development/<功能>/功能设计.md`。

## 7. 第二批 sub-agent 复核

2026-05-27 追加三名只读 sub-agent 对第二批缺口做功能层验证：

| Agent | 范围 | 结论 |
|---|---|---|
| Leibniz | session、agent、prompt、compaction | 无阻塞缺口。 |
| Poincare | tool、provider、config、shared protocol | 初次发现 3 个目录/alias/providerOptions 精确缺口；修复后二次复查无阻塞缺口。 |
| Noether | project、observability、CLI/interface、storage | 无阻塞缺口。 |

## 8. 剩余约束

- 当前仍是 M0 文档基线，不能证明 Rust 实现完成。
- 后续实现 PR 必须把对应功能目录的文档与代码一起维护；字段级 schema 以 Rust 类型 + OpenAPI/SDK diff 最终固化。
- 新发现的上游接口漂移必须先更新 `docs/research/opencode-upstream-analysis/附件/*`，再回写功能目录。

## 9. P0/P1 实现正确性缺口回补

2026-05-27 继续按用户列出的 P0/P1 实现正确性缺口回补：

| 级别 | 范围 | 已回补到 |
|---|---|---|
| P0 | session | 12 种 Message Part schema、ToolState union、AssistantMessage 全字段、`toModelMessages`、`filterCompacted`、`fromError`、processor stream/cleanup/result。 |
| P0 | compaction | prune protected tool、prune 算法、tail preserve budget、overflow replay、summary template、repeated compaction 的 previous-summary anchor。 |
| P0 | provider | overflow regex/status/stream patterns、temperature/topP/topK/options/smallOptions、message transform pipeline、interleaved reasoning 回写、schema transform。 |
| P1 | tool/config/plugin/background/reference/image/shared | `Tool.Context`、`Config.Info` 顶层字段与 legacy `tools` 迁移、plugin hooks、BackgroundJob schema、Reference/RepositoryCache、Image normalize、Provider schema transform。 |

## 10. P0/P1 sub-agent 复核

2026-05-27 使用三名只读 sub-agent 对 P0/P1 回补做功能层复核：

| Agent | 范围 | 结论 |
|---|---|---|
| Boole | session 主链：Message/Part/toModelMessages/filterCompacted/fromError/processor | 无阻塞缺口。 |
| Archimedes | compaction/provider/shared transform | 初次发现 previous-summary anchor 和 interleaved reasoning 回写缺口；修复后二次复查无阻塞缺口。 |
| Locke | tool/config/plugin/background/reference/image | 初次发现 legacy `tools` -> permission 迁移、Reference `list/get` 接口缺口；修复后二次复查无阻塞缺口。 |
