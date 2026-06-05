# 通用语言

## 1. 使用规则

本文术语是 `minimum-agent` 开发阶段的统一词表。代码、测试、文档新增概念时必须先在这里对齐；同一概念不得在不同目录使用不同名称。

## 2. 术语表

| 术语 | 中文名 | 阶段 | 定义 | 不是 |
|---|---|---|---|---|
| `Session` | 会话 | M1 | 一次用户与 agent 的连续交互聚合根。 | 不是单条消息，也不是 storage record。 |
| `Turn` | 轮次 | M1 | 一次 user input 到 assistant/tool 结束的执行单元。 | 不是 provider 的单个 stream chunk。 |
| `Message` | 消息 | M1 | user / assistant / tool / system 角色产生的可持久化记录。 | 不是 UI 渲染块。 |
| `Part` | 消息片段 | M1 | message 下的 text、tool call、tool result、usage、error 等结构化片段。 | 不是任意字符串拼接。 |
| `SessionProjector` | 会话投影器 | M1 | 把 `LlmEvent` 和 tool result 投影成 message / part 状态变化的 domain service。 | 不是 provider adapter。 |
| `ModelRef` | 模型引用 | M1 | `provider/model[:variant]` 的值对象；文法见 `接口设计.md` §2.1。 | 不是裸字符串。 |
| `LlmRequest` | 模型请求 | M1 | application 传给 provider port 的 provider-neutral 请求；字段随阶段扩展，见 `接口设计.md` §4.1/§4.2。 | 不是 OpenAI 原始 JSON DTO。 |
| `LlmEvent` | 模型事件 | M1 | provider streaming 输出的统一事件输入。 | 不是 session 持久化事件本身。 |
| `FinishReason` | 结束原因 | M1 | assistant turn 结束原因的值对象枚举（stop/length/error/cancelled，后续阶段追加）。 | 不是裸字符串，也不携带 usage。 |
| `AgentProfile` | Agent 配置档 | M1 | agent 名称、prompt 资产引用、模型偏好、step 上限、默认权限。 | 不是插件 manifest。 |
| `TraceId` | 链路 ID | M1 | 一次 run 全链路追踪 ID；内部新建用 `trc_`，外部传入的 W3C trace id 必须优先复用。 | 不是 session id，也不是实体主键。 |
| `ContextPack` | 上下文包 | M3 | 进入模型前的 system/context block 集合，包含 instruction、skill index、memory snapshot、MCP resource。 | 不是自由字符串拼接。 |
| `ContextBlock` | 上下文块 | M3 | 带来源、信任级别、token 预算和内容的上下文片段。 | 不是未标记来源的 prompt 文本。 |
| `InstructionSource` | 指令来源 | M3 | `AGENTS.md`、`CONTEXT.md` 等指令文件或配置项。 | 不是用户当前 prompt。 |
| `SkillIndex` | Skill 索引 | M3 | 可用 skill 的 name、description、location 列表。 | 不是完整 skill 正文。 |
| `SkillDefinition` | Skill 定义 | M3/M7 | 一个 `SKILL.md` 的 frontmatter 和正文；M3 只用 frontmatter，M7 才加载正文。 | 不是可执行插件。 |
| `SkillTool` | Skill 工具 | M7 | 按名称加载完整 skill 内容的工具。 | 不是自动注入所有 skill。 |
| `MemorySnapshot` | 记忆快照 | M3 | 当前 session 的 summary、last N turns、关键 anchors。 | 不是长期用户记忆库，也不是向量库。 |
| `WorkspaceRoot` | 工作区根 | M3 | 显式可信工作区绝对路径值对象。 | 不是当前 shell 工作目录的隐式别名。 |
| `WorkspacePath` | 工作区路径 | M3/M7 | 经规范化并确认在 root 内的路径；M3 仅服务 context 来源，M7 扩展到 tool 入参。 | 不是用户传入的原始路径。 |
| `ToolDefinition` | 工具定义 | M7 | 工具名称、描述、参数 schema、权限等级、timeout。 | 不是工具执行结果。 |
| `ToolCall` | 工具调用 | M7 | 模型请求执行某个 tool 的结构化调用。 | 不是 shell 命令字符串。 |
| `ToolResult` | 工具结果 | M7 | 工具执行后的结构化输出、错误、截断信息。 | 不是可直接信任的 prompt 内容。 |
| `PermissionRule` | 权限规则 | M7 | allow / deny / ask 的规则值对象。 | 不是 UI 选择状态。 |
| `PermissionDecision` | 权限判定 | M7 | evaluator 对一次 tool call 的最终判定。 | 不是可被 tool executor 修改的状态。 |
| `McpServerConfig` | MCP 服务配置 | M8 | local stdio MCP server 的 command、enabled、timeout。 | 不是远程 OAuth 配置。 |
| `McpToolDefinition` | MCP 工具定义 | M8 | MCP `tools/list` 转换后的 tool 定义。 | 不是可绕过 permission 的外部调用。 |
| `McpResourceRef` | MCP 资源引用 | M8 | MCP resource 的 server、uri、mime 元数据。 | 不是已信任的文件内容。 |
| `PluginCapability` | 插件能力 | M6 | provider/tool/prompt/memory/mcp/event/UI 扩展能力声明。 | 不是已运行的插件进程。 |
| `CapabilityManifest` | 能力清单 | M6 | 插件声明 capabilities、权限上限和版本的 schema。 | 不是配置文件的自由格式扩展。 |

## 3. 命名约束

- 公共领域类型禁止用裸 `String` / `i64` / `bool` 表示上述语义。
- Provider 原始 DTO、CLI DTO、plugin manifest DTO 不得泄漏到 domain。
- 事件名称使用过去式或明确的 stream 输入语义，例如 `SessionCreated`、`ToolCallRequested`、`TextDelta`。
- 插件相关命名统一使用 `Capability`，不把后续 runtime 误写成当前已实现能力。
