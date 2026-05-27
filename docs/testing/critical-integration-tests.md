# 关键集成测试清单

本清单是 Rust DDD 迁移的提交前门禁草案。编号稳定，后续实现 PR 必须引用对应 CIT，并说明不适用项。

| 编号 | 类型 | 名称 | 触发命令 | 覆盖范围 | 预期结果 |
|---|---|---|---|---|---|
| CIT-0001 | 单元 | Domain invariants | `cargo test --workspace --all-features domain_` | Session/Tool/Provider/Project/Permission 值对象和聚合不变量 | 所有 domain 测试通过，domain 行/分支覆盖率达到门禁。 |
| CIT-0002 | 场景 | Prompt to tool loop | `cargo test --workspace --all-features scenario_prompt_tool_loop` | prompt、provider mock、tool call、permission、message part 状态机 | SSE/事件序列和最终 session 状态与预期一致。 |
| CIT-0003 | 功能完整性 | HTTP contract diff | `cargo test --workspace --all-features http_contract_inventory` | 131 个 HTTP endpoint 的 method/path/operationId/input/output/error | Rust OpenAPI 与 `http-api-inventory.generated.md` 无差异。 |
| CIT-0004 | 功能完整性 | CLI contract diff | `cargo test --workspace --all-features cli_contract_inventory` | 默认 TUI 与 33 个 CLI 命令模块 | help snapshot 和参数 schema 与 `cli-command-inventory.generated.md` 一致。 |
| CIT-0005 | E2E | Serve + JS SDK | `cargo test --workspace --all-features e2e_serve_sdk` | `opencode serve`、Basic Auth、SDK session create/prompt/messages | mock provider 下全链路通过。 |
| CIT-0006 | E2E | Desktop sidecar lifecycle | `cargo test --workspace --all-features e2e_desktop_sidecar` | sidecar IPC、SQLite migration progress、`/global/health`、preload init | sidecar ready/stop 无孤儿进程。 |
| CIT-0007 | E2E | PTY websocket | `cargo test --workspace --all-features e2e_pty_websocket` | PTY CRUD、connect-token、WS input/output/cursor replay | ticket 校验和 replay 行为正确。 |
| CIT-0008 | 模糊 | Input parsers | `cargo fuzz run config_loader -- -max_total_time=1800` | Config/Tool/MCP/HTTP 输入解析 | 30 分钟无 crash；新增 crash 入 corpus。 |
| CIT-0009 | 对抗性 | Workspace and secret safety | `cargo test --workspace --all-features adversarial_workspace_secret` | 路径越界、prompt injection、secret redaction、dangerous command approval | 越权拒绝、secret 不出现在日志/prompt/trace。 |
| CIT-0010 | Agent Eval | Agent baseline | `cargo test --workspace --all-features eval_agent_baseline` | trajectory、tool-use accuracy、grounding、cost/latency | 指标不低于基线，回退 >5% 必须阻塞。 |
| CIT-0011 | 功能完整性 | Productization contract | `cargo test --workspace --all-features productization_contract` | install、Nix、CI container、release manifest、dependency patches | artifact/platform/checksum/installer 语义与上游清单一致。 |
| CIT-0012 | E2E | External integrations | `cargo test --workspace --all-features e2e_external_integrations` | GitHub Action mock event、VS Code file reference、Zed manifest、Slack/ACP adapter | 外部事件幂等，CLI/HTTP/SDK 调用正确，回复可追踪。 |
| CIT-0013 | 场景 | Cloud share and stats | `cargo test --workspace --all-features scenario_cloud_share_stats` | Console/Stats/Enterprise/Function mock、share policy、usage ingest | share/usage/account contract 正确，secret 脱敏，ingest 幂等。 |
| CIT-0014 | 功能完整性 | Repo asset and prompt contract | `cargo test --workspace --all-features prompt_asset_contract` | `.opencode` agent/command/skill/tool/theme/glossary、prompt 版本 | repo-local asset 加载受 workspace guard 约束，Prompt 回归通过。 |
| CIT-0015 | 功能完整性 | Shared library contract | `cargo test --workspace --all-features shared_library_contract` | `packages/core`/`packages/llm`/`http-recorder`/v2 specs | schema/protocol/recording/codegen 与上游基线无漂移。 |

## 运行约束

- PR 触碰 CLI/HTTP/SDK/Tool/Session/Provider/MCP/PTY/Desktop/Deployment/External/Cloud/Prompt Asset/Shared Library 任一路径时，至少运行对应 CIT。
- 新增或修改输入解析时必须运行 CIT-0008。
- 触碰 agent loop、Prompt、Tool、Provider、MCP、Session 时必须运行 CIT-0010。
- 触碰 install/Nix/release/container 必须运行 CIT-0011。
- 触碰 GitHub/Slack/VS Code/Zed/ACP 必须运行 CIT-0012。
- 触碰 Console/Stats/Enterprise/Function/share/usage 必须运行 CIT-0013。
- 触碰 `.opencode`、prompt、agent/command/skill/tool/theme/glossary 资产必须运行 CIT-0014。
- 触碰 `packages/core`、`packages/llm`、HTTP recorder、OpenAPI/codegen/v2 specs 必须运行 CIT-0015。
