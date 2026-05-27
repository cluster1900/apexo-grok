# SQLite 存储表清单（生成）

- 生成时间：2026-05-27
- 源文件：Drizzle `sqliteTable(...)` 定义。

| 表常量 | 物理表名 | 主要字段 | 源码 |
|---|---|---|---|
| `ProjectTable` | `project` | `id`, `worktree`, `vcs`, `name`, `icon_url`, `icon_url_override`, `icon_color`, `time_initialized`, `sandboxes`, `commands` | `packages/opencode/src/project/project.sql.ts` |
| `AccountTable` | `account` | `id`, `email`, `url`, `access_token`, `refresh_token`, `token_expiry` | `packages/opencode/src/account/account.sql.ts` |
| `AccountStateTable` | `account_state` | `id`, `active_account_id`, `active_org_id` | `packages/opencode/src/account/account.sql.ts` |
| `ControlAccountTable` | `control_account` | `email`, `url`, `access_token`, `refresh_token`, `token_expiry`, `active` | `packages/opencode/src/account/account.sql.ts` |
| `EventSequenceTable` | `event_sequence` | `aggregate_id`, `seq`, `owner_id` | `packages/opencode/src/sync/event.sql.ts` |
| `EventTable` | `event` | `id`, `aggregate_id`, `seq`, `type`, `data` | `packages/opencode/src/sync/event.sql.ts` |
| `SessionShareTable` | `session_share` | `session_id`, `id`, `secret`, `url` | `packages/opencode/src/share/share.sql.ts` |
| `SessionTable` | `session` | `id`, `project_id`, `workspace_id`, `parent_id`, `slug`, `directory`, `path`, `title`, `version`, `share_url`, `summary_additions`, `summary_deletions`, `summary_files`, `summary_diffs`, `cost`, `tokens_input`, `tokens_output`, `tokens_reasoning`, `tokens_cache_read`, `tokens_cache_write`, `revert`, `permission`, `agent`, `model` | `packages/opencode/src/session/session.sql.ts` |
| `MessageTable` | `message` | `id`, `session_id`, `data` | `packages/opencode/src/session/session.sql.ts` |
| `PartTable` | `part` | `id`, `message_id`, `session_id`, `data` | `packages/opencode/src/session/session.sql.ts` |
| `TodoTable` | `todo` | `session_id`, `content`, `status`, `priority`, `position` | `packages/opencode/src/session/session.sql.ts` |
| `SessionMessageTable` | `session_message` | `id`, `session_id`, `type`, `data` | `packages/opencode/src/session/session.sql.ts` |
| `PermissionTable` | `permission` | `project_id`, `data` | `packages/opencode/src/session/session.sql.ts` |
| `DataMigrationTable` | `data_migration` | `name`, `time_completed` | `packages/opencode/src/data-migration.sql.ts` |
| `WorkspaceTable` | `workspace` | `id`, `type`, `name`, `branch`, `directory`, `extra`, `project_id`, `time_used` | `packages/opencode/src/control-plane/workspace.sql.ts` |
