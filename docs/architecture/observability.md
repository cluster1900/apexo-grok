# 可观测性

## Trace 字段

所有日志和 span 至少包含：

| 字段 | 说明 |
|---|---|
| `trace_id` | 上游请求或本地生成 trace。 |
| `session_id` | 关联 session，无则为空。 |
| `message_id` | 关联 message，无则为空。 |
| `bounded_context` | `session`、`tool`、`provider`、`mcp`、`desktop` 等。 |
| `event` | 结构化事件名。 |
| `level` | `DEBUG/INFO/WARN/ERROR`。 |
| `gen_ai.provider.name` | Provider id。 |
| `gen_ai.request.model` | model id/variant。 |
| `gen_ai.usage.input_tokens` | 输入 token。 |
| `gen_ai.usage.output_tokens` | 输出 token。 |
| `tool.name` | tool id。 |
| `tool.call_id` | provider tool call id。 |
| `integration.name` | GitHub/Slack/VS Code/Zed/ACP 等外部入口，无则为空。 |
| `release.artifact` | 发布物名称和平台 target，无则为空。 |
| `cloud.account_id` | 云端账号/工作区 id，脱敏或 hash。 |
| `asset.version` | Prompt/skill/command/theme 等资产版本或 hash。 |

## Metrics

- `session_prompt_latency_ms`：prompt 到 assistant 完成。
- `provider_first_token_ms`：provider 首 token。
- `tool_execute_ms`：tool 执行耗时，按 tool id 分桶。
- `permission_wait_ms`：审批等待。
- `mcp_request_ms`：MCP request 耗时。
- `pty_active_sessions`：活跃 PTY。
- `sync_replay_events_total`：sync replay 事件数。
- `desktop_sidecar_start_ms`：Desktop sidecar 启动。
- `integration_events_total`：外部集成事件数，按 platform/result 分桶。
- `cloud_usage_ingest_total`：usage/stats ingest 事件数，按 provider/model/result 分桶。
- `release_artifact_publish_total`：发布物发布结果，按 artifact/platform/result 分桶。
- `prompt_asset_load_total`：repo-local prompt/asset 加载结果，按 asset type/result 分桶。
- `http_recorder_redaction_fail_total`：录制回放脱敏失败次数。

## 日志安全

- secret/API key/token、prompt 原文、文件内容默认脱敏或采样。
- shell command 记录结构化 argv/permission，不记录 secret env。
- tool/provider 错误保留错误码、状态码和 retryable，不直接记录完整 response body。
