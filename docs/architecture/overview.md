# 架构总览

当前架构处于重启草案阶段。本文只记录已经生效的最小判断，不提前冻结完整 DDD 边界。

## 目标

先做一个小而真实的 Rust coding agent 核心：

- 能从 CLI 进入。
- 能把用户输入转成明确的应用用例。
- 能逐步接入 provider、workspace 文件操作和命令执行。
- 每一步都有可运行测试，而不是只完成文档矩阵。

当前第一条主线为 [`minimum-agent`](minimum-agent/架构设计.md)。它拆成 M0-M9：先实现 domain kernel，再做 mock CLI、ContextPack、session store、真实 provider、capability kernel、read/skill tool、MCP Lite，最后进入 write/shell permission；其它上游能力以插件或接口层方式安装进来。

全局边界：

- [`context-map.md`](context-map.md)：限界上下文和阶段启用顺序。
- [`ubiquitous-language.md`](ubiquitous-language.md)：通用语言和命名约束。
- [`events.md`](events.md)：`LlmEvent` / `DomainEvent` schema 登记。

## 当前 crate 边界

| Crate | 责任 | 当前状态 |
|---|---|---|
| `opencode-core` | 核心类型和用例入口，暂不做 I/O。 | 只有重启基线元数据。 |
| `opencode-cli` | 命令行入口。 | 只输出当前项目状态。 |

新增 crate 的条件：

- 现有 crate 已经出现清晰的双向压力，继续放在一起会造成真实耦合问题。
- 文档先说明新 crate 的调用方、被调用方、非目标和迁移方式。
- 至少有一个测试能证明拆分后的行为边界。

## 工具链与版本决策

| 项 | 决定 | 理由 |
|---|---|---|
| Rust edition | `2024`（`Cargo.toml` workspace 统一） | 使用当前 stable 默认 edition，避免后续大规模迁移。 |
| `rust-version` (MSRV) | `1.85`（edition 2024 的最低 stable） | 与 workspace `rust-version` 对齐；`rust-toolchain.toml` 的 `stable` 只是开发默认，CI 仍需单独验证 MSRV。 |
| unsafe | workspace `unsafe_code = "forbid"` | 业务与基础类库均无 unsafe 需求；如未来确需，必须单独 ADR + `SAFETY` 注释。 |
| 生产 lint | `unwrap_used` / `expect_used` / `panic` / `print_stdout` / `print_stderr` / `todo` = deny | 落实 `AGENTS.md §5` 错误处理与日志红线；CLI 用户输出走 `writeln!` 到显式 handle，不用 `println!`。 |

edition / MSRV 调整属架构变化，必须先改本表再改 `Cargo.toml`（`AGENTS.md §10`）。

## 暂缓边界

以下能力暂不拆独立模块：

- 完整 Provider catalog。
- 完整 Tool 执行和权限审批。
- Session 压缩 / summary / revert / share。
- 完整 MCP/plugin runtime。
- Desktop/WebJS/HTTP API。
- OpenAPI/SDK 生成。

其中 `minimum-agent` 会先落最小 Provider streaming、ContextPack、Session 持久化、read/skill/MCP Lite、Tool/Permission 子集；完整能力后续按插件或接口层进入设计。

## 安全不变量

后续实现 agent 能力时必须保留这些不变量：

- 文件操作只能发生在显式 workspace root 内。
- 命令执行必须带权限级别、超时和参数化 argv。
- 外部内容进入模型前必须被标记为不可信输入。
- secret 不进入日志、prompt、配置文件或命令行参数。
- 每次 agent 运行都有可追踪的 session id 和 trace id。
