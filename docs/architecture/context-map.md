# 限界上下文图

## 1. 当前状态

本文描述 `minimum-agent` 即将进入开发时的 DDD 限界上下文。当前代码尚未实现这些上下文，进入 M1 前以本文作为边界约束。

## 2. 上下文清单

| 上下文 | 负责 | 不负责 | 启用阶段 |
|---|---|---|---|
| Conversation | `Session`、`Turn`、`Message`、`Part`、投影状态机。 | Provider 认证、文件系统、命令执行。 | M1 |
| Provider | `ModelRef`、`LlmRequest`、`LlmEvent`、streaming adapter port。 | 修改 session、执行 tool。 | M1 type / M5 adapter |
| Agent | agent profile、step 限制、prompt 资产引用。 | Prompt 文件运行时加载细节、UI 呈现。 | M1-M4 |
| Context | `ContextPack`、instruction、skill index、memory snapshot、MCP resource block。 | 长期向量记忆、外部插件执行、provider streaming。 | M3 |
| Storage | `SessionRepository` port 和本地持久化。 | 领域不变量、provider 协议。 | M4 |
| Workspace | `WorkspaceRoot`、`WorkspacePath`、路径 containment。 | 业务权限审批、provider 上下文拼装。 | M3 minimal / M7 tools |
| Tool | `ToolDefinition`、`ToolCall`、`ToolResult`、tool registry。 | 权限最终判定、session storage 写入。 | M7-M9 |
| Permission | allow / deny / ask 规则和审批结果。 | 实际文件写入或 shell 执行。 | M7-M9 |
| MCP | local stdio server、tool/resource bridge、status。 | remote HTTP/SSE、OAuth、dynamic add。 | M8 |
| Extension | capability manifest、注册校验、权限上限。 | 外部插件进程运行。 | M6 |
| Interface | CLI 参数解析、stdout/stderr、交互式 ask。 | 领域规则、provider/tool 内部实现。 | M2-M9 |

## 3. 依赖方向

```text
interface
  -> application
    -> domain

infrastructure
  -> application ports
  -> domain types
```

允许的 application 编排：

```text
RunPrompt use case
  -> Context
  -> Conversation
  -> Provider port
  -> SessionProjector
  -> Tool port
  -> Permission port
  -> MCP port
  -> Storage port
```

禁止：

- domain 依赖 interface / infrastructure。
- provider adapter 直接写 session repository。
- tool executor 直接绕过 permission。
- MCP tool 直接绕过 ToolRegistry。
- plugin 拿到 domain 内部可变引用。
- storage schema 反向决定领域模型。

## 4. 阶段启用图

| 阶段 | 启用上下文 | 说明 |
|---|---|---|
| M1 | Conversation、Provider port、Agent | 只做纯 domain 类型和 projector。 |
| M2 | Interface、Application | fake provider stream 进入 projector，输出 deterministic text。 |
| M3 | Context、Workspace minimal | instruction、skill index、memory snapshot 组成 ContextPack；`WorkspaceRoot` 只用于 context 来源 containment。 |
| M4 | Storage | 保存和恢复 session/context metadata，不引入完整 migration。 |
| M5 | Provider infrastructure | 一个 OpenAI-compatible adapter 接入 application port。 |
| M6 | Extension | capability manifest 注册和拒绝越权 capability。 |
| M7 | Workspace tools、Tool read、Skill | tool 级 workspace guard、只读工具和 skill tool 进入 agent loop。 |
| M8 | MCP | local stdio MCP tool/resource bridge。 |
| M9 | Permission、Tool write/shell | 写文件和命令执行必须经审批。 |

## 5. 跨上下文通信

| 来源 | 目标 | 方式 | 规则 |
|---|---|---|---|
| Provider | Conversation | `LlmEvent` | 只能由 application 调用 projector。 |
| Context | Provider | `ContextPack` -> `LlmRequest.system` | 所有 block 标记来源和信任边界。 |
| Tool | Conversation | `ToolResult` -> `Part` | 结果先截断和不可信包裹。 |
| MCP | Tool / Context | `ToolDefinition` / `McpResourceRef` | MCP tool 经 ToolRegistry；resource 经 ContextPack。 |
| Permission | Tool | `PermissionDecision` | ask 未获批准即不执行。 |
| Extension | Provider / Tool / Prompt / Memory / MCP / Event | `PluginCapability` | 注册时校验 schema 和权限上限。 |
| Interface | Application | command DTO | DTO 不进入 domain。 |

## 6. 防腐层

外部 DTO 必须在 infrastructure 或 interface 转换：

- Provider SSE / JSON frame -> `LlmEvent`。
- CLI args -> application command。
- tool JSON args -> typed tool input。
- skill frontmatter -> `SkillIndexItem`。
- instruction file -> `ContextBlock`。
- memory source -> `MemorySnapshot`。
- MCP tool/resource DTO -> `ToolDefinition` / `McpResourceRef`。
- plugin manifest JSON -> `PluginCapability`。
- filesystem path -> `WorkspacePath`。

转换失败必须给出字段路径或路径错误原因。
