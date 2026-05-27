# Tool 清单（生成）

- 生成时间：2026-05-27
- 源入口：`packages/opencode/src/tool/registry.ts`。
- 内置 Tool 数量：18

| tool id | 导出 | 入参字段 | 源码 |
|---|---|---|---|
| `apply_patch` | `ApplyPatchTool` | `patchText` | `packages/opencode/src/tool/apply_patch.ts` |
| `edit` | `EditTool` | `filePath`, `oldString`, `newString`, `replaceAll` | `packages/opencode/src/tool/edit.ts` |
| `glob` | `GlobTool` | `pattern`, `path` | `packages/opencode/src/tool/glob.ts` |
| `grep` | `GrepTool` | `pattern`, `path`, `include` | `packages/opencode/src/tool/grep.ts` |
| `invalid` | `InvalidTool` | `tool`, `error` | `packages/opencode/src/tool/invalid.ts` |
| `lsp` | `LspTool` | `operation`, `filePath`, `line`, `character`, `query` | `packages/opencode/src/tool/lsp.ts` |
| `plan_exit` | `PlanExitTool` | 无 | `packages/opencode/src/tool/plan.ts` |
| `question` | `QuestionTool` | `questions` | `packages/opencode/src/tool/question.ts` |
| `read` | `ReadTool` | `filePath`, `offset`, `limit` | `packages/opencode/src/tool/read.ts` |
| `repo_clone` | `RepoCloneTool` | `repository`, `refresh`, `branch` | `packages/opencode/src/tool/repo_clone.ts` |
| `repo_overview` | `RepoOverviewTool` | `repository`, `path`, `depth` | `packages/opencode/src/tool/repo_overview.ts` |
| `bash` | `ShellTool` | `command`, `timeout`, `workdir`, `description` | `packages/opencode/src/tool/shell.ts`, `packages/opencode/src/tool/shell/prompt.ts` |
| `skill` | `SkillTool` | `name` | `packages/opencode/src/tool/skill.ts` |
| `task` | `TaskTool` | `description`, `prompt`, `subagent_type`, `task_id`, `command`, `background` | `packages/opencode/src/tool/task.ts` |
| `todowrite` | `TodoWriteTool` | `todos` | `packages/opencode/src/tool/todo.ts` |
| `webfetch` | `WebFetchTool` | `url`, `format`, `timeout` | `packages/opencode/src/tool/webfetch.ts` |
| `websearch` | `WebSearchTool` | `query`, `numResults`, `livecrawl`, `type`, `contextMaxCharacters` | `packages/opencode/src/tool/websearch.ts` |
| `write` | `WriteTool` | `content`, `filePath` | `packages/opencode/src/tool/write.ts` |

## Tool 支撑模块

这些模块不直接暴露为 LLM tool id，但属于 tool contract 的实现边界，迁移时必须纳入同一测试基线。

| 模块 | 职责 | 源码 |
|---|---|---|
| `external-directory` | 工作区外路径审批，按 file/directory 生成 `external_directory` permission pattern。 | `packages/opencode/src/tool/external-directory.ts` |
| `mcp-websearch` | Exa/Parallel MCP websearch 请求、SSE/JSON 响应解析、timeout 与 header 处理。 | `packages/opencode/src/tool/mcp-websearch.ts` |
| `truncate` / `truncation-dir` | tool 输出截断、落盘目录和 metadata。 | `packages/opencode/src/tool/truncate.ts`、`packages/opencode/src/tool/truncation-dir.ts` |
| `json-schema` | plugin/custom tool Zod/JSON Schema 兼容转换。 | `packages/opencode/src/tool/json-schema.ts` |
