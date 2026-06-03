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

## Phase 1：选择第一条主线

只选择一个主目标：

| 选项 | 说明 | 代价 |
|---|---|---|
| CLI 对话 | 先做最小交互循环。 | Provider 和 session 会很快成为前置依赖。 |
| Provider 直连 | 先证明模型调用链路。 | 需要先处理凭据和流式协议。 |
| Workspace 文件编辑 | 先证明安全文件边界。 | 暂时没有完整 agent 体验。 |
| Tool 执行 | 先证明命令权限模型。 | 安全设计成本最高。 |

Phase 1 确认前，不新增功能目录。

## Phase 2：垂直切片

围绕 Phase 1 主目标做一个端到端薄切片：

- 一个用例。
- 一个入口。
- 一个持久化或外部依赖替身。
- 一组单元测试和一条命令级 smoke test。

## Phase 3：按压力拆分

只有在薄切片变复杂后才拆分：

- core 内部模块先于新 crate。
- crate 拆分先写架构说明。
- 每次拆分都要删除旧路径或旧文档，避免双轨维护。
