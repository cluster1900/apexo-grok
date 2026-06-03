# opencode-rs

`opencode-rs` 是一个重新设计中的 Rust coding agent 项目。旧的细粒度功能拆分和 M1/M2 进度记录已经清空，仓库现在回到最小可编译基线，用于重新讨论架构和实现顺序。

## 项目目标

- 以 Rust 实现可审计、可测试、可分层演进的 coding agent core。
- 对齐上游 `opencode` 的 CLI、HTTP/OpenAPI、Tool、Session、Provider、MCP、Desktop/WebJS 等能力。
- 按 DDD 拆分业务边界，保持 `domain -> application -> infrastructure/interface` 的依赖约束。
- 强化 agent 安全边界：workspace 沙箱、命令审批、Prompt 注入防护、secret 脱敏、trace 全链路贯穿。
- 建立功能完整性、E2E、对抗性测试和 Agent Eval 基线，避免迁移过程中丢功能。

## 当前状态

- 文档内容已经重新初始化，旧功能拆分被清空；各一级目录 README 规范仍保留。
- Rust workspace 已收敛为 `opencode-core` 和 `opencode-cli` 两个 crate。
- 真实 agent loop、provider、tool、session、MCP、desktop、HTTP API 都尚未实现。

## 仓库结构

```text
.
├── AGENTS.md
├── Cargo.toml
├── crates/
│   ├── opencode-cli/
│   └── opencode-core/
└── docs/
    ├── README.md
    ├── architecture/
    │   ├── README.md
    │   └── overview.md
    ├── development/
    │   ├── README.md
    │   └── restart-plan.md
    ├── progress/
    │   ├── README.md
    │   └── overview.md
    ├── research/
    │   ├── README.md
    │   └── restart-2026-06-03.md
    ├── testing/README.md
    └── deployment/README.md
```

## 本地验证

```sh
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-features
cargo deny check
```

## 协作入口

开始任何任务前先读 `AGENTS.md`。该文件定义了本仓库的硬约束，包括文档先行、Rust 工程规范、DDD 分层、agent 安全、测试门禁和文档同步要求。文档目录规则见 `docs/README.md` 和各一级目录 `README.md`。
