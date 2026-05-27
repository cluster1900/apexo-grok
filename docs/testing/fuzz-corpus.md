# 模糊测试目标与语料清单

当前为迁移前规划，Rust fuzz target 尚未实现。首个实现 PR 必须补齐命令、语料规模和最近运行记录。

| Target | 入口函数 | 触发命令 | 当前语料 | 覆盖 |
|---|---|---|---|---|
| `config_loader` | `opencode_config::parse_jsonc` | `cargo fuzz run config_loader -- -max_total_time=1800` | 待实现 | JSONC、remote config、legacy 字段迁移。 |
| `tool_input` | `opencode_tool::decode_tool_input` | `cargo fuzz run tool_input -- -max_total_time=1800` | 待实现 | Tool params、provider tool call、invalid arguments。 |
| `mcp_frame` | `opencode_mcp::decode_frame` | `cargo fuzz run mcp_frame -- -max_total_time=1800` | 待实现 | JSON-RPC、StreamableHTTP/SSE frame、OAuth callback payload。 |
| `workspace_path` | `opencode_workspace::normalize_path` | `cargo fuzz run workspace_path -- -max_total_time=1800` | 待实现 | 路径穿越、symlink、Windows/Unix 路径。 |
| `openapi_request` | `opencode_http::decode_request` | `cargo fuzz run openapi_request -- -max_total_time=1800` | 待实现 | HTTP params/query/payload schema 反序列化。 |
| `installer_args` | `opencode_release::parse_installer_args` | `cargo fuzz run installer_args -- -max_total_time=1800` | 待实现 | version、binary、platform、PATH policy、archive name。 |
| `integration_event` | `opencode_integration::decode_event` | `cargo fuzz run integration_event -- -max_total_time=1800` | 待实现 | GitHub/Slack webhook、editor selection、ACP frame。 |
| `repo_asset` | `opencode_prompt::decode_repo_asset` | `cargo fuzz run repo_asset -- -max_total_time=1800` | 待实现 | `.opencode` JSONC、frontmatter、Markdown skill/command/tool metadata。 |
| `recorder_cassette` | `opencode_recorder::decode_cassette` | `cargo fuzz run recorder_cassette -- -max_total_time=1800` | 待实现 | HTTP/WS cassette、matching key、redaction rules。 |

## 种子来源

- `docs/research/opencode-upstream-analysis/附件/http-api-inventory.generated.md`
- `docs/research/opencode-upstream-analysis/附件/tool-inventory.generated.md`
- `/Users/hawk_wu/Desktop/opencode/packages/opencode/test/config/fixtures/`
- `/Users/hawk_wu/Desktop/opencode/packages/opencode/test/server/httpapi-exercise/`
- `/Users/hawk_wu/Desktop/opencode/install`
- `/Users/hawk_wu/Desktop/opencode/github/README.md`
- `/Users/hawk_wu/Desktop/opencode/sdks/vscode/package.json`
- `/Users/hawk_wu/Desktop/opencode/.opencode/`
- `/Users/hawk_wu/Desktop/opencode/packages/http-recorder/test/`
