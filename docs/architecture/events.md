# 事件 schema 登记

## 1. 当前范围

本文登记 `minimum-agent` 需要的最小事件边界。当前代码尚未开始，schema 进入实现时必须保持版本化并带 `trace_id`。

事件分两类：

- `LlmEvent`：Provider stream 输入，供 `SessionProjector` 消费。
- `DomainEvent`：领域内已经发生的事实，供 application / event subscriber 使用。

## 2. 通用字段

所有可持久化或可订阅事件必须包含：

| 字段 | 说明 |
|---|---|
| `schema_version` | 当前为 `1`。 |
| `trace_id` | 全链路追踪 ID。 |
| `session_id` | 所属 session。 |
| `turn_id` | 所属 turn；session 创建事件可为空。 |
| `occurred_at` | UTC 时间。 |
| `bounded_context` | 产生事件的上下文。 |

## 3. LlmEvent

| 事件 | 阶段 | payload | 说明 |
|---|---|---|---|
| `TextDelta` | M1 | `message_id?`、`text` | provider 流式文本增量。 |
| `ReasoningDelta` | M5 | `text` | 推理文本；M1 可先不实现。 |
| `ToolCallDelta` | M7 | `tool_call_id`、`name?`、`arguments_delta` | tool call 参数流。 |
| `ToolCallFinished` | M7 | `tool_call_id`、`name`、`arguments_json` | 参数收敛后进入 schema 校验。 |
| `UsageDelta` | M5 | `input_tokens?`、`output_tokens?`、`cache_tokens?` | usage 统计。 |
| `Finished` | M1 | `finish_reason` | 当前 assistant turn 结束。 |
| `ProviderError` | M1 | `code`、`message`、`retryable` | provider 或 fake provider 失败；M1 只建模和投影，M2 才由 fake provider 触发。 |

M1 只实现 `TextDelta`、`Finished`、`ProviderError`。其它事件进入对应阶段前再实现。

## 4. DomainEvent

| 事件 | 阶段 | 产生方 | 说明 |
|---|---|---|---|
| `SessionCreated` | M1 | Conversation | 创建 session。 |
| `UserMessageAppended` | M1 | Conversation | 用户消息进入 session。 |
| `AssistantMessageStarted` | M1 | Conversation | assistant message 开始。 |
| `AssistantTextProjected` | M1 | Conversation | 文本 delta 已投影为 part。 |
| `TurnFinished` | M1 | Conversation | 当前 turn 完成。 |
| `ContextPackBuilt` | M3 | Context | instruction / skill index / memory snapshot 已组装。 |
| `SkillIndexed` | M3 | Context | skill frontmatter 已进入 index。 |
| `MemorySnapshotBuilt` | M3 | Context | 轻量 memory snapshot 已构造。 |
| `SessionPersisted` | M4 | Storage | session 保存成功。 |
| `CapabilityRegistered` | M6 | Extension | 插件能力已注册。 |
| `CapabilityRejected` | M6 | Extension | 插件能力因越权或 schema 错误被拒绝。 |
| `ToolCallRequested` | M7 | Tool | provider 请求执行工具。 |
| `ToolResultRecorded` | M7 | Tool / Conversation | tool result 已记录到 session。 |
| `SkillLoaded` | M7 | Tool / Context | skill tool 已加载 skill 正文。 |
| `McpServerStatusChanged` | M8 | MCP | MCP server status 变化。 |
| `McpToolRegistered` | M8 | MCP / Tool | MCP tool 已注册到 ToolRegistry。 |
| `McpResourceRead` | M8 | MCP / Context | MCP resource 已进入 ContextPack。 |
| `PermissionRequested` | M7 | Permission | 需要用户审批。 |
| `PermissionResolved` | M7 | Permission | 审批结果已确定。 |

## 5. 订阅规则

- 订阅者位于 application 或 infrastructure，domain 不依赖订阅者。
- 订阅者必须幂等，重复事件不能造成重复写文件、重复执行命令或重复扣费。
- 插件 event subscriber 只能接收已脱敏 payload。
- event schema 修改必须同步测试和迁移记录。
