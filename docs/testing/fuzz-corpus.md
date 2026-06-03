# 模糊测试目标与语料登记

## 1. 当前状态

当前代码尚未开始，以下 fuzz target 是 `minimum-agent` 阶段性要求。实现对应解析入口时必须创建 target，并在本文件记录最近一次运行结果。

## 2. 目标清单

| Target | 阶段 | 入口 | 触发命令 | 当前状态 |
|---|---|---|---|---|
| `model_ref_parser` | M1 | `ModelRef::try_from` | `cargo fuzz run model_ref_parser -- -max_total_time=1800` | 待实现。 |
| `skill_frontmatter` | M3 | `SkillDefinition` frontmatter parser | `cargo fuzz run skill_frontmatter -- -max_total_time=1800` | 待实现。 |
| `context_pack` | M3 | `ContextPackBuilder` block parser/budgeter | `cargo fuzz run context_pack -- -max_total_time=1800` | 待实现。 |
| `llm_event_stream` | M5 | Provider SSE / JSON frame parser | `cargo fuzz run llm_event_stream -- -max_total_time=1800` | 待实现。 |
| `plugin_manifest` | M6 | capability manifest parser | `cargo fuzz run plugin_manifest -- -max_total_time=1800` | 待实现。 |
| `workspace_path` | M7 | `WorkspaceRoot::resolve` | `cargo fuzz run workspace_path -- -max_total_time=1800` | 待实现。 |
| `tool_call_decode` | M7 | tool args JSON schema decode | `cargo fuzz run tool_call_decode -- -max_total_time=1800` | 待实现。 |
| `mcp_config` | M8 | MCP local stdio config parser | `cargo fuzz run mcp_config -- -max_total_time=1800` | 待实现。 |

## 3. 登记格式

每次运行后追加：

```markdown
## <target> — YYYY-MM-DD

- **命令**：
- **运行时长**：
- **语料规模**：起始 N -> 结束 M
- **崩溃数**：
- **新增崩溃样本路径**：
- **结论**：
```

历史发现的崩溃样本必须归档到 `fuzz/corpus/<target>/`，并关联修复 PR。
