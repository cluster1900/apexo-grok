# opencode-rs

`opencode-rs` 是将开源 coding agent [`opencode`](https://github.com/sst/opencode) 迁移到 Rust 生态的项目。目标不是简单重写命令行入口，而是用 Rust core 承接 agent 循环、会话、工具执行、Provider、MCP、配置、存储和权限模型，同时保留上游 Web UI / Desktop / TUI / SDK / 插件生态的兼容入口。

项目当前处于 **M1：Rust workspace skeleton 已闭环**。仓库中已有上游功能扫描、架构拆分、功能设计、进度记录和测试基线，并已落位最小 Rust workspace / crate 边界、HTTP health/OpenAPI router、可运行 TCP server smoke、TypeScript SDK codegen seam、Desktop sidecar JSON contract 与第一条 mock provider application 垂直链路；真实 agent 主链路仍待实现。

## 项目目标

- 以 Rust 实现可审计、可测试、可分层演进的 coding agent core。
- 对齐上游 `opencode` 的 CLI、HTTP/OpenAPI、Tool、Session、Provider、MCP、Desktop/WebJS 等能力。
- 按 DDD 拆分业务边界，保持 `domain -> application -> infrastructure/interface` 的依赖约束。
- 强化 agent 安全边界：workspace 沙箱、命令审批、Prompt 注入防护、secret 脱敏、trace 全链路贯穿。
- 建立功能完整性、E2E、对抗性测试和 Agent Eval 基线，避免迁移过程中丢功能。

## 当前状态

- Rust workspace skeleton 位于 [`crates/`](crates/)，当前包含 domain 值对象、application provider registry、provider transport 占位、server router/OpenAPI/SDK codegen 和 desktop sidecar contract。
- 上游源码扫描基线位于 [`docs/research/opencode-upstream-analysis/`](docs/research/opencode-upstream-analysis/)。
- 全局架构入口位于 [`docs/architecture/overview.md`](docs/architecture/overview.md)。
- 功能设计入口位于 [`docs/development/`](docs/development/)。
- 当前进度入口位于 [`docs/progress/overview.md`](docs/progress/overview.md)。
- 测试与完整性验证入口位于 [`docs/testing/`](docs/testing/)。

更多文档目录规则见 [`docs/README.md`](docs/README.md)。

## 规划阶段

1. **M0**：完成文档和协议基线，生成清单并与上游源码对齐。
2. **M1**：建立 Rust workspace/server skeleton、OpenAPI/SDK 生成链路和 WebJS desktop sidecar contract。
3. **M2**：打通 session、agent、tool、provider、config、project、storage 主路径。
4. **M3**：补齐 MCP、plugin、PTY、LSP、share、sync、desktop native 能力。
5. **M4**：完善部署分发、外部集成、cloud/share/stats、repo-local prompt/asset 和 shared library/codegen 兼容。
6. **M5**：完成 CLI/TUI/Web UI 兼容性测试、E2E、Agent Eval 和发布门禁。

## 协作入口

开始任何任务前先读 [`AGENTS.md`](AGENTS.md)。该文件定义了本仓库的硬约束，包括文档先行、Rust 工程规范、DDD 分层、agent 安全、测试门禁和文档同步要求。
