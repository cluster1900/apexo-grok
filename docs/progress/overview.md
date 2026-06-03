# 进度总览

日期：2026-06-03

## 当前状态

仓库已重新初始化为最小基线。

| 区域 | 状态 |
|---|---|
| 文档 | 已清空旧功能目录，并新增 `minimum-agent` 第一条主线设计、最小范围调研、context/skill/MCP 调研、架构边界和测试门禁。 |
| Rust workspace | 已收敛为 `opencode-core` 和 `opencode-cli`。 |
| Agent loop | `minimum-agent` 已拆为 M0-M9 小阶段，代码未开始。 |
| Context / Skill / Memory | M3 进入精简 ContextPack，M7 进入 skill tool，代码未开始。 |
| Provider | M5 才接 OpenAI-compatible adapter，依赖调研未开始。 |
| Tool 执行 | M7/M8/M9 才进入 read/skill/MCP/write/shell，代码未开始。 |
| Session | M1 定义 domain，M4 才持久化，代码未开始。 |
| MCP/plugin | M8 做 MCP Lite；M6 做 capability kernel；完整 runtime 未开始。 |
| Desktop/WebJS/HTTP API | 未开始。 |

## 当前主线

| 功能 | 状态 | 说明 |
|---|---|---|
| [`minimum-agent`](minimum-agent/功能现状.md) | 未开始 | 文档待人工确认，代码未开始。已拆为 M0-M9，并补齐 `research`、`architecture`、`development`、`testing` 的支撑文档；M1 只做 domain kernel，M3 做 ContextPack，M8 做 MCP Lite，M9 才做 write/shell。 |

## 作废说明

旧 M1/M2 文档、功能拆分、测试矩阵和进度记录不再代表当前计划。后续讨论必须从 `docs/research/restart-2026-06-03.md` 和 `docs/development/restart-plan.md` 开始。

## 下一个决策点

需要人工确认 `minimum-agent` 的阶段拆分：

- M1：只做 domain kernel。
- M2：只做 `opencode run --mock`。
- M3：只做 ContextPack：instruction、skill index、memory snapshot。
- M4：只做 session repository。
- M5：只做真实 provider adapter。
- M6：只做 capability kernel。
- M7：只做 read/grep + skill tool。
- M8：只做 local stdio MCP Lite。
- M9：再进入 write/shell 和 permission。

建议按这个顺序开发，禁止跨阶段提前实现。
