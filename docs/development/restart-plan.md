# 重新设计计划

## Phase 0：重置基线

目标：

- 删除旧的细粒度文档和过早 crate 边界。
- 保留最小可编译 workspace。
- 明确旧 M1/M2 状态不再有效。

验收：

- `cargo fmt --all -- --check` 通过。
- `cargo clippy --workspace --all-targets --all-features -- -D warnings` 通过。
- `cargo test --workspace --all-features` 通过。

## Phase 1：第一条主线已确认

第一条主线已确认为 `minimum-agent`：先做最小 opencode 纵向闭环，并在前期纳入精简 ContextPack / Skill / Memory / MCP Lite，再逐步开放 Provider、Tool、Permission 和插件 capability。

当前阶段拆分：

| 阶段 | 说明 | 入口文档 |
|---|---|---|
| M0 | 人工确认调研、架构、开发、测试门禁。 | `docs/progress/minimum-agent/功能现状.md` |
| M1 | 只做 domain kernel。 | `docs/development/minimum-agent/阶段拆分.md` |
| M2 | 只做 `opencode run --mock`。 | `docs/development/minimum-agent/接口设计.md` |
| M3 | 只做 ContextPack：instruction、skill index、memory snapshot。 | `docs/research/opencode-context-extension-surfaces/调研报告_2026-06-03.md` |
| M4 | 只做 session repository。 | `docs/development/minimum-agent/数据设计.md` |
| M5 | 只做一个 OpenAI-compatible provider adapter。 | `docs/research/minimum-agent-scope/调研报告_2026-06-03.md` |
| M6 | 只做 capability kernel。 | `docs/architecture/minimum-agent/架构设计.md` |
| M7 | 只做 workspace read + skill tool。 | `docs/testing/critical-integration-tests.md` |
| M8 | 只做 local stdio MCP Lite。 | `docs/research/opencode-context-extension-surfaces/调研报告_2026-06-03.md` |
| M9 | 再进入 write/shell 和 permission。 | `docs/testing/critical-integration-tests.md` |

Phase 1 不再讨论“CLI 对话 / Provider 直连 / Workspace 文件编辑 / Tool 执行”四选一；这些能力已经被拆入 M1-M9，禁止跨阶段提前实现。

## Phase 2：垂直切片

围绕 `minimum-agent` 做端到端薄切片：

- 一个用例。
- 一个入口。
- 一个持久化或外部依赖替身。
- 一组单元测试和一条命令级 smoke test。

## Phase 3：按压力拆分和插件化

只有在薄切片变复杂后才拆分：

- core 内部模块先于新 crate。
- crate 拆分先写架构说明。
- 每次拆分都要删除旧路径或旧文档，避免双轨维护。
- 后续 Provider、Tool、Prompt、Memory、MCP、UI、Stats、Sync 等能力优先通过 capability manifest 或接口层扩展。
- 插件不得覆盖 workspace guard、permission、secret redaction、session schema、ContextPack 信任边界。
