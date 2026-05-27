# 对抗性测试用例库

## ADV-0001 Path Traversal

- **输入**：tool/file/storage/workspace path 包含 `../`、绝对路径、symlink escape。
- **覆盖**：workspace-file-vcs、tools、storage-sync。
- **预期**：路径值对象规范化后拒绝越界，日志/trace 不包含敏感文件内容。

## ADV-0002 Shell Injection

- **输入**：shell/repo/mcp/local server 参数包含 `;`、`&&`、管道、命令替换。
- **覆盖**：tools、mcp-lsp、plugin-extension。
- **预期**：生产命令使用参数化构造；需要 shell 的地方必须进入审批流。

## ADV-0003 Prompt Injection From Tool Output

- **输入**：read/webfetch/mcp/tool result 中夹带“忽略系统提示”等内容。
- **覆盖**：agent-loop、tools、provider-model、prompt。
- **预期**：外部内容截断并包裹为 untrusted input；不得改变 tool permission 或 system prompt。

## ADV-0004 Secret Exfiltration

- **输入**：配置、env、provider auth、MCP header、plugin hook 输出中含 secret。
- **覆盖**：provider-model、mcp-lsp、plugin-extension、observability。
- **预期**：secret 不进入 prompt/log/command line；错误信息脱敏。

## ADV-0005 Replay Poisoning

- **输入**：sync replay 包含 stale seq、gap seq、wrong aggregate、owner mismatch、unknown type。
- **覆盖**：storage-sync、session。
- **预期**：stale 幂等忽略，gap 报错，owner mismatch 忽略，unknown type 拒绝。

## ADV-0006 ACP Stdout Pollution

- **输入**：ACP session 中触发日志、tool output、provider error。
- **覆盖**：acp、interface-cli-http。
- **预期**：stdout 只输出 JSON-RPC NDJSON 帧，日志走 stderr。

## ADV-0007 Plugin Supply Chain

- **输入**：npm/file plugin entrypoint 越界、engines 不兼容、hook 抛错、长时间不返回。
- **覆盖**：plugin-extension、tui。
- **预期**：不兼容跳过，hook failure 隔离；Rust 增强要求 timeout/cancellation。

## ADV-0008 Cost Exhaustion

- **输入**：超长 prompt、循环 tool call、max steps 后继续要求执行。
- **覆盖**：agent-loop、provider-model、tools。
- **预期**：上下文预算与 MAX_STEPS reminder 生效，长任务可取消。

## ADV-0009 App Shell Boundary

- **输入**：恶意 `auth_token`、`opencode://` deep link、desktop IPC payload、sidecar password echoed in error/log。
- **覆盖**：app-shell、interface-cli-http、storage-sync。
- **预期**：token 读完清理 URL；IPC schema fail-fast；renderer 不能直接访问 Node/Electron；sidecar password 不进入日志/prompt/配置。
