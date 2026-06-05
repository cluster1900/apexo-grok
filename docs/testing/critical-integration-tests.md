# 关键集成测试清单

## 1. minimum-agent

### CIT-0001：Domain session projector

- **类型**：单元 / 场景
- **触发命令**：`cargo test -p opencode-core domain::`
- **覆盖范围**：`Session`、`Message`、`Part`、`SessionProjector`、`FinishReason`。
- **预期结果**：text delta、finish 和 provider error 可投影；finish 写入 finish reason 但不生成 usage part；finish 后继续追加 text 被拒绝；provider error 使 turn 进入 failed；domain 不依赖 I/O。
- **阶段**：M1

### CIT-0002：Domain value object invariants

- **类型**：单元
- **触发命令**：`cargo test -p opencode-core domain::`
- **覆盖范围**：`SessionId`、`TurnId`、`MessageId`、`PartId`、`TraceId`、`ModelRef`、`FinishReason`。
- **预期结果**：空值、非法前缀、非法 ID body、非法 provider/model、非法 variant、未知 finish reason 被拒绝；内部 `trc_` 与外部 W3C trace id 可 round-trip。
- **阶段**：M1

### CIT-0003：Mock CLI run

- **类型**：E2E / 功能完整性
- **触发命令**：`cargo test --workspace --test e2e_mock_run`
- **覆盖范围**：`opencode run --mock <prompt>`。
- **预期结果**：stdout deterministic，退出码 0；fake provider error 时退出码非 0；不读 API key、不写磁盘。
- **阶段**：M2

### CIT-0004：Session persistence

- **类型**：场景 / E2E
- **触发命令**：`cargo test --workspace --test scenario_session_store`
- **覆盖范围**：`SessionRepository`、session 保存和恢复。
- **预期结果**：同一 session id 可恢复 message/part/context metadata；保存失败不泄漏 secret；schema version 被记录。
- **阶段**：M4

### CIT-0005：Provider stream mapping

- **类型**：单元 / 场景
- **触发命令**：`cargo test -p opencode-core provider_stream`
- **覆盖范围**：OpenAI-compatible SSE/JSON fixture 到 `LlmEvent` 的转换。
- **预期结果**：text delta、finish、usage、provider error 均映射正确；畸形 frame 返回协议错误。
- **阶段**：M5

### CIT-0006：Provider protocol fuzz

- **类型**：模糊
- **触发命令**：`cargo fuzz run llm_event_stream -- -max_total_time=1800`
- **覆盖范围**：SSE / JSON frame 解析。
- **预期结果**：无 panic、无越界内存、错误包含字段路径或 frame 位置。
- **阶段**：M5

### CIT-0007：Workspace read containment

- **类型**：单元 / E2E / 对抗性
- **触发命令**：`cargo test --workspace --test e2e_workspace_read`
- **覆盖范围**：`WorkspaceRoot`、`WorkspacePath`、`read`、`grep/glob`。
- **预期结果**：workspace 内可读；`../`、软链越界和敏感文件按规则拒绝或 ask。
- **阶段**：M7

### CIT-0008：Tool output trust boundary

- **类型**：场景 / Agent Eval / 对抗性
- **触发命令**：`cargo test --workspace --test scenario_tool_context`
- **覆盖范围**：tool result 回灌到下一轮 `LlmRequest`。
- **预期结果**：tool output 被截断并包裹 `<untrusted_input>`；夹带指令不会直接变成系统指令。
- **阶段**：M7

### CIT-0009：Permission gate for write and shell

- **类型**：E2E / 对抗性
- **触发命令**：`cargo test --workspace --test e2e_permission_gate`
- **覆盖范围**：`edit/write`、`shell`、allow / deny / ask。
- **预期结果**：默认 ask；reject 后不执行；always 只在当前 scope 生效；dangerous 不自动放行。
- **阶段**：M9

### CIT-0010：Command timeout and cancellation

- **类型**：场景 / E2E
- **触发命令**：`cargo test --workspace --test e2e_command_timeout`
- **覆盖范围**：shell timeout、Ctrl+C / cancellation。
- **预期结果**：timeout 生成 tool error；取消后 1s 内退出且不留孤儿子进程。
- **阶段**：M9

### CIT-0011：Capability manifest

- **类型**：单元 / 功能完整性 / 对抗性 / 模糊
- **触发命令**：`cargo test -p opencode-core extension:: && cargo fuzz run plugin_manifest -- -max_total_time=1800`
- **覆盖范围**：provider/tool/prompt/memory/mcp/event capability manifest。
- **预期结果**：合法 manifest 可注册；越权 capability 被拒绝；插件不能覆盖 workspace guard、permission、secret redaction、session schema、ContextPack 边界。
- **阶段**：M6

### CIT-0012：ContextPack instruction and memory

- **类型**：单元 / 场景 / 对抗性
- **触发命令**：`cargo test -p opencode-core context_pack`
- **覆盖范围**：`ContextPackBuilder`、`InstructionSource`、`MemorySnapshot`。
- **预期结果**：只读取 workspace 内 instruction；block 带 source/trust；memory snapshot 不包含 secret；`--no-context` 禁用 context block。
- **阶段**：M3

### CIT-0013：Skill index discovery

- **类型**：单元 / 功能完整性 / 模糊
- **触发命令**：`cargo test -p opencode-core skill_index && cargo fuzz run skill_frontmatter -- -max_total_time=1800`
- **覆盖范围**：`.opencode/skill/**/SKILL.md`、`.opencode/skills/**/SKILL.md` frontmatter。
- **预期结果**：合法 skill 进入 index；非法 frontmatter 被拒绝；index 不包含完整 skill 正文。
- **阶段**：M3

### CIT-0014：Skill tool load

- **类型**：场景 / E2E / 对抗性
- **触发命令**：`cargo test --workspace --test e2e_skill_tool`
- **覆盖范围**：`skill` tool、skill permission、skill content 输出。
- **预期结果**：默认 ask；reject 不读取正文；allow 后输出 `<skill_content>`；skill 内容按不可信输入处理。
- **阶段**：M7

### CIT-0015：MCP Lite status and tool bridge

- **类型**：场景 / E2E / 对抗性
- **触发命令**：`cargo test --workspace --test e2e_mcp_lite`
- **覆盖范围**：local stdio MCP config、status、tools/list、tools/call。
- **预期结果**：disabled 不连接；启动失败记录 `mcp.failed`；MCP tool 命名空间化；调用前经过 permission；timeout 关闭子进程。
- **阶段**：M8

### CIT-0016：MCP resource context bridge

- **类型**：场景 / 对抗性 / 模糊
- **触发命令**：`cargo test --workspace --test scenario_mcp_resource && cargo fuzz run mcp_config -- -max_total_time=1800`
- **覆盖范围**：MCP resources/list、resources/read、resource -> ContextPack。
- **预期结果**：resource 内容被截断并包裹 `<untrusted_input>`；resource 不存在返回 `mcp.resource_not_found`；非法 MCP config 被拒绝。
- **阶段**：M8
