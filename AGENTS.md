# AGENTS.md

**opencode-rs**（把开源 coding agent `opencode` 移植到 Rust）的协作总规约。读者是参与本仓库的人和 AI 协作者。本文件只列项目级硬约束，功能 / 架构 / 测试细节都在 `docs/` 子规范里，详情见 [`docs/README.md`](docs/README.md)。

## 1. 必读

接到任务后按此顺序拉齐上下文：

1. 本文件。
2. [`docs/README.md`](docs/README.md) → 任务相关的 `docs/architecture/<组件>/` → `docs/development/<功能>/` → `docs/progress/<功能>/`。

**新功能必须先做调研并写入 `docs/research/<主题>/`，经人类确认后才允许进入开发**。文档与代码不一致时以代码 + `progress/` 为准。

## 2. docs 目录

- 一级子目录限定：`architecture/`、`development/`、`progress/`、`research/`、`testing/`、`deployment/`。
- 每个一级目录有自己的 `README.md` 规范，写作 / 命名 / 章节要求以该规范为准；本文件不重复。
- 同一功能在 `development/`、`progress/`、`testing/` 下的子目录名必须保持一致。

## 3. 编码红线

> 违反即不予合并。

### 3.1 反过度设计

- **优先用成熟 crate**。新引入的 crate 必须许可证兼容、近 12 个月有维护、无重大未修复 CVE，对比记录写入 `docs/research/<topic>/`。
- **小函数禁提公共 API**：实现 <5 行 或 只有一处调用方的函数不提到模块 / crate 公共 API；需要复用时再提取。
- **禁空抽象**：trait / 泛型 / feature flag 只在当前已有 ≥2 实现或下个 sprint 必现第二实现时引入。
- **禁半成品 API**：未实现的能力不要先暴露签名。
- **基础类库一层完成**：utility / wrapper / adapter 层级 ≤2，含 trait。业务层走 §4 DDD。

### 3.2 注释规范（强制）

- **所有 `pub` 项** 必须有 `///` rustdoc：做什么 / 参数 / 返回值 / 错误（`# Errors`）/ 副作用 / 示例（`# Examples`，公共 API 必含）。
- **trait 实现** 用 `///` 写本实现的差异点，不照抄 trait 文档。
- **函数内连续 ≥3 行的代码段** 前置一行 `//`，说明 **为什么这么做 / 怎么实现**；禁逐行翻译代码。
- **`unsafe` 块** 紧邻 `// SAFETY: <理由>`。
- **测试函数** 函数体首部说明：被测对象、输入构造依据、断言判定理由、关联编号（若有 `CIT-NNNN`）。
- **TODO** 必须形如 `// TODO(<人 or issue#>): <描述> — <里程碑 / 日期>`。
- 禁僵尸注释（被注释掉的代码直接删）、禁流水账注释。

### 3.3 命名与可见性

- crate / 模块名小写下划线；二进制 / CLI 命令短横线。
- 默认 `pub(crate)`；新增 `pub` 必须能解释为什么外部需要。
- 公共类型禁止裸 `String` / `i64` / `bool` 表达领域语义（用值对象 / newtype）。

## 4. DDD 分层（业务层）

业务层（`opencode-core` 及以上）严格遵循 DDD；基础类库不强制，遵循 §3.1。

- **分层**：`domain/`（零 I/O、零 runtime 依赖）→ `application/`（用例编排）；`infrastructure/`（适配器、ACL）和 `interface/`（CLI / TUI / HTTP）。依赖方向 `interface → application → domain ← infrastructure`，禁反向。
- **聚合根**：一次事务只改一个；不变量在方法内保护；跨聚合走领域事件 / 最终一致性。
- **值对象**：newtype + `TryFrom` 构造校验；按值相等；路径 / 模型 ID / Session ID / Token 计数等都建模为值对象。
- **领域事件**：命名过去式；`serde` schema 版本化；带 `trace_id`；订阅者位于 application 且必须幂等。
- **跨上下文通信**：领域事件 或 防腐层 ACL，二选一；外部 DTO 严禁泄漏到 domain。

具体边界 / 通用语言 / 事件 schema 见 `docs/architecture/`。

## 5. Rust 工程

- **工具链**：`rust-toolchain.toml` 固定 stable；`cargo fmt --all -- --check`、`cargo clippy --workspace --all-targets --all-features -- -D warnings`、`cargo deny check`、`cargo audit` CI 必绿。
- **错误处理双轨**：基础设施 / 不可恢复 → `thiserror` 枚举或 `anyhow::Error`；可预期业务失败 → `Result<T, DomainError>`。生产路径禁 `unwrap` / `expect` / `panic!`（启动期不变量保证除外）。`?` + `map_err` 转语义，禁 `From` 自动转换掩盖语义。
- **异步**：统一 `tokio` multi-thread runtime；锁不跨 `.await`；阻塞调用包 `spawn_blocking`；长任务必须支持 `CancellationToken`，Ctrl+C/SIGTERM ≤1s 退出且不留孤儿子进程。
- **序列化**：公共边界（CLI / 配置 / HTTP / Tool 协议 / Provider / 事件）必须 `serde` + 显式校验；反序列化失败必须定位到字段路径 + 行号；禁 `#[serde(default)]` 掩盖必填。
- **配置**：单一配置文件（路径在 `docs/architecture/` 决策记录），加载链 默认值 → 配置文件 → `OPENCODE_*` 环境变量 → CLI flag，后覆盖前；fail-fast；secret 字段只允许 env / secret manager，禁落配置文件。
- **日志**：`tracing` + `tracing-subscriber`；JSON 字段必含 `trace_id` / `session_id` / `level` / `event` / `bounded_context`；禁 `println!` / `eprintln!` 进生产代码；PII / secret 统一脱敏。时间一律 UTC。

## 6. Agent 安全要点

opencode-rs 是会执行命令、改文件、调网络的 coding agent。下列是 **项目级硬约束**，具体设计 / 实现见 `docs/architecture/`：

- **工作区沙箱**：所有文件操作基于显式 workspace root 值对象，路径规范化 + 校验在 workspace 内；越界即拒绝并写 trace。
- **命令执行**：参数化构造（`Command::arg`，禁 shell 字符串拼接）；按权限级别审批（`read/write/execute/network/dangerous`），危险操作显式二次确认；带超时与资源上限。
- **Prompt 注入防护**：外部内容（用户输入、文件、命令输出、工具返回、网页）进入 LLM 前必须截断 + `<untrusted_input>` 包裹；system prompt 只允许 schema 校验过的安全字段插值；LLM 返回的工具参数必须经 schema 重校验。
- **凭据**：secret 走 env / secret manager，禁入配置文件 / prompt / 日志 / 命令行；测试 / 预发 / 生产凭据严格隔离。
- **Trace**：复用上游 `trace_id`，缺失才新建；贯穿 CLI → application → provider → tool 全链路；业务输出必须可溯源到 Session / 模型档位 / Prompt 版本 / 工具链。
- **MCP / 第三方扩展**：外部来源默认不受信，权限不高于 `ask`；以子进程隔离 + 熔断，禁运行时拉取未审批 server。

权限模型 / 审批流程 / 子 agent 边界 / agent 循环 / 流式 / session / 上下文工程 / Provider 与 MCP 抽象等细节，见 `docs/architecture/<对应组件>/`。

## 7. Prompt 资产

- 所有 Prompt 放 `prompts/<scope>.<kind>.<version>.md`，代码只引用路径 + 版本号；禁多行 prompt 硬编码进 `.rs`。
- 改动 Prompt 必须出回归报告（见 `docs/testing/`）。

## 8. 测试门禁（提交前必跑）

详见 [`docs/testing/README.md`](docs/testing/README.md)。每个 PR 合并前下列 **7 类测试缺一不可**（不适用须 PR 描述显式声明并经 reviewer 同意）：

1. **单元测试** — `cargo test --workspace --all-features`；domain 行+分支覆盖率 ≥80%，application ≥70%。
2. **场景测试** — application 层用例主流程 + 已知分支。
3. **功能完整性测试** — 对照 `docs/development/<功能>/功能设计.md` 的"目标 / 非目标"逐条验证。
4. **E2E 测试** — 从 CLI / HTTP 入口跑全链路，Provider 用 mock / 录像回放。
5. **模糊测试** — 改输入解析（配置、Tool 协议、Prompt 拼装、MCP 帧）时跑对应 `cargo-fuzz` target。
6. **对抗性测试** — 触碰 §6 安全边界时跑 `docs/testing/adversarial-cases.md` 对应用例。
7. **Agent Eval** — 触碰 agent 循环 / Tool / Provider / MCP / Session / Prompt 时跑 `docs/testing/` 下的 eval（trajectory / tool-use accuracy / LLM-as-judge / cost-latency budget / 基线回归）。

附加（视改动性质）：静态检查全绿、Prompt 回归、性能基准、跨平台冒烟、关键集成测试清单（`docs/testing/critical-integration-tests.md`）全跑。

## 9. 可观测与 NFR

- Trace / Metrics / 日志的字段约定见 `docs/architecture/observability.md`（包含 OpenTelemetry GenAI 语义约定 `gen_ai.*`）。
- 高风险变更（影响金钱 / 触及安全边界 / 改 agent 循环 / 改默认 model / 改 Prompt 主路径）必须 feature flag 默认 off + 灰度留档。
- SLO 在 `docs/architecture/slo.md` 维护。
- 外部依赖（LLM Provider / Git / Shell / Editor / MCP Server）必须标降级策略并有对抗性测试。
- 持久化 / 协议 schema 变更必须有可回滚迁移脚本，留档 `docs/deployment/migration/`。

## 10. 文档同步与开发流程

> **任务改变实现状态却未更新文档 = 任务未完成。PR 描述必须列出涉及的文档清单（含 "无"）。**

- 架构变化（边界 / 通用语言 / 外部接口 / 安全模型 / agent 运行模型 / 部署形态）→ 改 `docs/architecture/` 后再改代码。
- 进度变化 → 改 `docs/progress/<功能>/功能现状.md`。
- 调研 → `docs/research/`、设计 → `docs/development/`、部署 → `docs/deployment/`、测试 → `docs/testing/`。

豁免（开工后补 progress 即可）：hotfix、typo、纯重构、纯测试补充、构建脚本调整。

**开发流程**：调研 → 人类确认 → 架构 + 设计文档 → 文档评审 → 实施（顺序：domain → application → infrastructure → interface → 配置 / Prompt）→ §8 测试门禁 → 代码评审 → 进度回写。Bug 修复至少 2 次复现验证。

## 11. 速查清单

- **反过度设计**：能用现成 crate 就用；5 行以下 / 单调用方不提公共 API；trait / 泛型 / flag 仅在已有 ≥2 实现或下 sprint 必现时引入。
- **注释**：所有 `pub` 项 rustdoc 完备；函数内 ≥3 行段落写"为什么 + 怎么做"；`unsafe` 必有 `SAFETY`；测试说明被测对象 / 输入 / 断言 / 关联编号；TODO 带主人和期限。
- **DDD**：不越上下文边界；单事务单聚合根；不变量方法内保护；值对象不可裸 `String/i64`；事件过去式 + 订阅幂等。
- **Rust**：分层无反向；错误双轨；生产无 `unwrap/expect/panic`；`tokio` 单一 runtime；锁不跨 `.await`；阻塞包 `spawn_blocking`；公共边界 `serde` + 校验；fmt / clippy / deny / audit 全绿。
- **Agent 安全**：workspace 路径规范化；命令参数化 + 权限审批 + 超时；外部内容 `<untrusted_input>` 包裹；Tool 返回 schema 重校验；secret 不入 prompt / log / cmdline；trace_id 全链路。
- **测试**：单元 + 场景 + 功能完整性 + E2E + 模糊 + 对抗性 + Eval 7 类齐备；不适用必须显式声明。
- **文档**：调研先于开发；架构先改后写代码；进度同步 `progress/`；PR 描述列文档变更清单（含 Prompt 版本与 Eval 基线变化）。
