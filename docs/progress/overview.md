# 进度总览

日期：2026-06-03

## 当前状态

仓库已重新初始化为最小基线。

| 区域 | 状态 |
|---|---|
| 文档 | 已清空旧功能目录，仅保留重新设计入口。 |
| Rust workspace | 已收敛为 `opencode-core` 和 `opencode-cli`。 |
| Agent loop | 未开始。 |
| Provider | 未开始。 |
| Tool 执行 | 未开始。 |
| Session | 未开始。 |
| MCP/plugin | 未开始。 |
| Desktop/WebJS/HTTP API | 未开始。 |

## 作废说明

旧 M1/M2 文档、功能拆分、测试矩阵和进度记录不再代表当前计划。后续讨论必须从 `docs/research/restart-2026-06-03.md` 和 `docs/development/restart-plan.md` 开始。

## 下一个决策点

需要先选择 Phase 1 的第一条主线：

- CLI 对话。
- Provider 直连。
- Workspace 文件编辑。
- Tool 执行。

选定后再补最小调研和设计文档。
