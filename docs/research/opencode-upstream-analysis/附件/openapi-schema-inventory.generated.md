# OpenAPI 入参出参 Schema 清单（生成）

- 生成时间：2026-05-27
- 来源：`/Users/hawk_wu/Desktop/opencode/packages/sdk/openapi.json`
- Path 数量：113
- Operation 数量：131
- Component schema 数量：290
- 说明：本清单是对外 SDK/OpenAPI 的字段级 schema/ref 索引；内部 raw route 以 `http-api-inventory.generated.md` 为补充。

| 方法 | 路径 | operationId | tag | path params | query | request body | success responses | error responses |
|---|---|---|---|---|---|---|---|---|
| PUT | `/auth/{providerID}` | `auth.set` | control | providerID:string! | 无 | `Auth` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| DELETE | `/auth/{providerID}` | `auth.remove` | control | providerID:string! | 无 | `无` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/log` | `app.log` | control | 无 | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/global/health` | `global.health` | global | 无 | 无 | `无` | 200:object | 400:BadRequestError |
| GET | `/global/event` | `global.event` | global | 无 | 无 | `无` | 200:GlobalEvent | 400:BadRequestError |
| GET | `/global/config` | `global.config.get` | global | 无 | 无 | `无` | 200:Config | 400:BadRequestError |
| PATCH | `/global/config` | `global.config.update` | global | 无 | 无 | `Config` | 200:Config | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/global/dispose` | `global.dispose` | global | 无 | 无 | `无` | 200:boolean | 400:BadRequestError |
| POST | `/global/upgrade` | `global.upgrade` | global | 无 | 无 | `object` | 200:anyOf(object \| object) | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/event` | `event.subscribe` | event | 无 | directory:string?, workspace:string? | `无` | 200:Event | 无 |
| GET | `/config` | `config.get` | config | 无 | directory:string?, workspace:string? | `无` | 200:Config | 400:BadRequestError |
| PATCH | `/config` | `config.update` | config | 无 | directory:string?, workspace:string? | `Config` | 200:Config | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/config/providers` | `config.providers` | config | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError |
| GET | `/experimental/console` | `experimental.console.get` | experimental | 无 | directory:string?, workspace:string? | `无` | 200:ConsoleState | 400:BadRequestError<br>500:effect_HttpApiError_InternalServerError |
| GET | `/experimental/console/orgs` | `experimental.console.listOrgs` | experimental | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError<br>500:effect_HttpApiError_InternalServerError |
| POST | `/experimental/console/switch` | `experimental.console.switchOrg` | experimental | 无 | directory:string?, workspace:string? | `object` | 200:boolean | 无 |
| GET | `/experimental/tool` | `tool.list` | experimental | 无 | directory:string?, workspace:string?, provider:string!, model:string! | `无` | 200:ToolList | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/experimental/tool/ids` | `tool.ids` | experimental | 无 | directory:string?, workspace:string? | `无` | 200:ToolIDs | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/experimental/worktree` | `worktree.list` | experimental | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:anyOf(WorktreeError \| InvalidRequestError) |
| POST | `/experimental/worktree` | `worktree.create` | experimental | 无 | directory:string?, workspace:string? | `WorktreeCreateInput` | 200:Worktree | 400:anyOf(WorktreeError \| InvalidRequestError) |
| DELETE | `/experimental/worktree` | `worktree.remove` | experimental | 无 | directory:string?, workspace:string? | `WorktreeRemoveInput` | 200:boolean | 400:anyOf(WorktreeError \| InvalidRequestError) |
| POST | `/experimental/worktree/reset` | `worktree.reset` | experimental | 无 | directory:string?, workspace:string? | `WorktreeResetInput` | 200:boolean | 400:anyOf(WorktreeError \| InvalidRequestError) |
| GET | `/experimental/session` | `experimental.session.list` | experimental | 无 | directory:string?, workspace:string?, roots:anyOf(boolean \| string)?, start:number?, cursor:number?, search:string?, limit:number?, archived:anyOf(boolean \| string)? | `无` | 200:array | 400:BadRequestError |
| GET | `/experimental/resource` | `experimental.resource.list` | experimental | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError |
| GET | `/find` | `find.text` | file | 无 | directory:string?, workspace:string?, pattern:string! | `无` | 200:array | 400:BadRequestError |
| GET | `/find/file` | `find.files` | file | 无 | directory:string?, workspace:string?, query:string!, dirs:string?, type:string?, limit:integer? | `无` | 200:array | 400:BadRequestError |
| GET | `/find/symbol` | `find.symbols` | file | 无 | directory:string?, workspace:string?, query:string! | `无` | 200:array | 400:BadRequestError |
| GET | `/file` | `file.list` | file | 无 | directory:string?, workspace:string?, path:string! | `无` | 200:array | 400:BadRequestError |
| GET | `/file/content` | `file.read` | file | 无 | directory:string?, workspace:string?, path:string! | `无` | 200:FileContent | 400:BadRequestError |
| GET | `/file/status` | `file.status` | file | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| POST | `/instance/dispose` | `instance.dispose` | instance | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| GET | `/path` | `path.get` | instance | 无 | directory:string?, workspace:string? | `无` | 200:Path | 400:BadRequestError |
| GET | `/vcs` | `vcs.get` | instance | 无 | directory:string?, workspace:string? | `无` | 200:VcsInfo | 400:BadRequestError |
| GET | `/vcs/status` | `vcs.status` | instance | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/vcs/diff` | `vcs.diff` | instance | 无 | directory:string?, workspace:string?, mode:string!, context:integer? | `无` | 200:array | 400:BadRequestError |
| GET | `/vcs/diff/raw` | `vcs.diff.raw` | instance | 无 | directory:string?, workspace:string? | `无` | 200:无 | 400:BadRequestError |
| POST | `/vcs/apply` | `vcs.apply` | instance | 无 | directory:string?, workspace:string? | `object` | 200:object | 400:anyOf(VcsApplyError \| InvalidRequestError) |
| GET | `/command` | `command.list` | instance | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/agent` | `app.agents` | instance | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/skill` | `app.skills` | instance | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/lsp` | `lsp.status` | instance | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/formatter` | `formatter.status` | instance | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/mcp` | `mcp.status` | mcp | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError |
| POST | `/mcp` | `mcp.add` | mcp | 无 | directory:string?, workspace:string? | `object` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/mcp/{name}/auth` | `mcp.auth.start` | mcp | name:string! | directory:string?, workspace:string? | `无` | 200:object | 400:anyOf(McpUnsupportedOAuthError \| InvalidRequestError)<br>404:McpServerNotFoundError |
| DELETE | `/mcp/{name}/auth` | `mcp.auth.remove` | mcp | name:string! | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError<br>404:McpServerNotFoundError |
| POST | `/mcp/{name}/auth/callback` | `mcp.auth.callback` | mcp | name:string! | directory:string?, workspace:string? | `object` | 200:MCPStatus | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:McpServerNotFoundError |
| POST | `/mcp/{name}/auth/authenticate` | `mcp.auth.authenticate` | mcp | name:string! | directory:string?, workspace:string? | `无` | 200:MCPStatus | 400:anyOf(McpUnsupportedOAuthError \| InvalidRequestError)<br>404:McpServerNotFoundError |
| POST | `/mcp/{name}/connect` | `mcp.connect` | mcp | name:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError<br>404:McpServerNotFoundError |
| POST | `/mcp/{name}/disconnect` | `mcp.disconnect` | mcp | name:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError<br>404:McpServerNotFoundError |
| GET | `/project` | `project.list` | project | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/project/current` | `project.current` | project | 无 | directory:string?, workspace:string? | `无` | 200:Project | 400:BadRequestError |
| POST | `/project/git/init` | `project.initGit` | project | 无 | directory:string?, workspace:string? | `无` | 200:Project | 400:BadRequestError |
| PATCH | `/project/{projectID}` | `project.update` | project | projectID:string! | directory:string?, workspace:string? | `object` | 200:Project | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:ProjectNotFoundError |
| GET | `/pty/shells` | `pty.shells` | pty | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/pty` | `pty.list` | pty | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| POST | `/pty` | `pty.create` | pty | 无 | directory:string?, workspace:string? | `object` | 200:Pty | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/pty/{ptyID}` | `pty.get` | pty | ptyID:string! | directory:string?, workspace:string? | `无` | 200:Pty | 400:BadRequestError<br>404:PtyNotFoundError |
| PUT | `/pty/{ptyID}` | `pty.update` | pty | ptyID:string! | directory:string?, workspace:string? | `object` | 200:Pty | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:PtyNotFoundError |
| DELETE | `/pty/{ptyID}` | `pty.remove` | pty | ptyID:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError<br>404:PtyNotFoundError |
| POST | `/pty/{ptyID}/connect-token` | `pty.connectToken` | pty | ptyID:string! | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError<br>403:PtyForbiddenError<br>404:PtyNotFoundError |
| GET | `/question` | `question.list` | question | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| POST | `/question/{requestID}/reply` | `question.reply` | question | requestID:string! | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:QuestionNotFoundError |
| POST | `/question/{requestID}/reject` | `question.reject` | question | requestID:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:QuestionNotFoundError |
| GET | `/permission` | `permission.list` | permission | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| POST | `/permission/{requestID}/reply` | `permission.reply` | permission | requestID:string! | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:PermissionNotFoundError |
| GET | `/provider` | `provider.list` | provider | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError |
| GET | `/provider/auth` | `provider.auth` | provider | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError |
| POST | `/provider/{providerID}/oauth/authorize` | `provider.oauth.authorize` | provider | providerID:string! | directory:string?, workspace:string? | `object` | 200:ProviderAuthAuthorization | 400:anyOf(ProviderAuthError1 \| InvalidRequestError) |
| POST | `/provider/{providerID}/oauth/callback` | `provider.oauth.callback` | provider | providerID:string! | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(ProviderAuthError1 \| InvalidRequestError) |
| GET | `/session` | `session.list` | session | 无 | directory:string?, workspace:string?, scope:string?, path:string?, roots:anyOf(boolean \| string)?, start:number?, search:string?, limit:number? | `无` | 200:array | 400:BadRequestError |
| POST | `/session` | `session.create` | session | 无 | directory:string?, workspace:string? | `object` | 200:Session | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/session/status` | `session.status` | session | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/session/{sessionID}` | `session.get` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:Session | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| PATCH | `/session/{sessionID}` | `session.update` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:Session | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| DELETE | `/session/{sessionID}` | `session.delete` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| GET | `/session/{sessionID}/children` | `session.children` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:array | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| GET | `/session/{sessionID}/todo` | `session.todo` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:array | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| GET | `/session/{sessionID}/diff` | `session.diff` | session | sessionID:string! | directory:string?, workspace:string?, messageID:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/session/{sessionID}/message` | `session.messages` | session | sessionID:string! | directory:string?, workspace:string?, limit:integer?, before:string? | `无` | 200:array | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| POST | `/session/{sessionID}/message` | `session.prompt` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| GET | `/session/{sessionID}/message/{messageID}` | `session.message` | session | sessionID:string!, messageID:string! | directory:string?, workspace:string? | `无` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| DELETE | `/session/{sessionID}/message/{messageID}` | `session.deleteMessage` | session | sessionID:string!, messageID:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError<br>409:SessionBusyError |
| POST | `/session/{sessionID}/fork` | `session.fork` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:Session | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| POST | `/session/{sessionID}/abort` | `session.abort` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/session/{sessionID}/init` | `session.init` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| POST | `/session/{sessionID}/share` | `session.share` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:Session | 400:BadRequestError<br>404:NotFoundError<br>500:effect_HttpApiError_InternalServerError |
| DELETE | `/session/{sessionID}/share` | `session.unshare` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:Session | 400:BadRequestError<br>404:NotFoundError<br>500:effect_HttpApiError_InternalServerError |
| POST | `/session/{sessionID}/summarize` | `session.summarize` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| POST | `/session/{sessionID}/prompt_async` | `session.prompt_async` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 204:无 | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| POST | `/session/{sessionID}/command` | `session.command` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| POST | `/session/{sessionID}/shell` | `session.shell` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError<br>409:SessionBusyError |
| POST | `/session/{sessionID}/revert` | `session.revert` | session | sessionID:string! | directory:string?, workspace:string? | `object` | 200:Session | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError<br>409:SessionBusyError |
| POST | `/session/{sessionID}/unrevert` | `session.unrevert` | session | sessionID:string! | directory:string?, workspace:string? | `无` | 200:Session | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError<br>409:SessionBusyError |
| POST | `/session/{sessionID}/permissions/{permissionID}` | `permission.respond` | session | sessionID:string!, permissionID:string! | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:anyOf(NotFoundError \| PermissionNotFoundError) |
| PATCH | `/session/{sessionID}/message/{messageID}/part/{partID}` | `part.update` | session | sessionID:string!, messageID:string!, partID:string! | directory:string?, workspace:string? | `Part` | 200:Part | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| DELETE | `/session/{sessionID}/message/{messageID}/part/{partID}` | `part.delete` | session | sessionID:string!, messageID:string!, partID:string! | directory:string?, workspace:string? | `无` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| POST | `/sync/start` | `sync.start` | sync | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| POST | `/sync/replay` | `sync.replay` | sync | 无 | directory:string?, workspace:string? | `object` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/sync/steal` | `sync.steal` | sync | 无 | directory:string?, workspace:string? | `object` | 200:object | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/sync/history` | `sync.history.list` | sync | 无 | directory:string?, workspace:string? | `object` | 200:array | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| GET | `/api/session` | `v2.session.list` | v2 | 无 | directory:string?, workspace:string?, limit:number?, order:string?, path:string?, roots:anyOf(boolean \| string)?, start:number?, search:string?, cursor:string? | `无` | 200:V2SessionsResponse | 400:anyOf(InvalidCursorError \| InvalidRequestError \| InvalidRequestError)<br>401:UnauthorizedError |
| POST | `/api/session/{sessionID}/prompt` | `v2.session.prompt` | v2 | sessionID:string! | directory:string?, workspace:string? | `object` | 200:SessionMessage | 400:InvalidRequestError<br>401:UnauthorizedError<br>404:SessionNotFoundError<br>503:ServiceUnavailableError |
| POST | `/api/session/{sessionID}/compact` | `v2.session.compact` | v2 | sessionID:string! | directory:string?, workspace:string? | `无` | 204:无 | 400:InvalidRequestError<br>401:UnauthorizedError<br>404:SessionNotFoundError<br>503:ServiceUnavailableError |
| POST | `/api/session/{sessionID}/wait` | `v2.session.wait` | v2 | sessionID:string! | directory:string?, workspace:string? | `无` | 204:无 | 400:InvalidRequestError<br>401:UnauthorizedError<br>404:SessionNotFoundError<br>503:ServiceUnavailableError |
| GET | `/api/session/{sessionID}/context` | `v2.session.context` | v2 | sessionID:string! | directory:string?, workspace:string? | `无` | 200:array | 400:InvalidRequestError<br>401:UnauthorizedError<br>404:SessionNotFoundError<br>500:UnknownError1 |
| GET | `/api/session/{sessionID}/message` | `v2.session.messages` | v2 messages | sessionID:string! | directory:string?, workspace:string?, limit:number?, order:string?, cursor:string? | `无` | 200:V2SessionMessagesResponse | 400:anyOf(InvalidCursorError \| InvalidRequestError)<br>401:UnauthorizedError<br>404:SessionNotFoundError<br>500:UnknownError1 |
| GET | `/api/model` | `v2.model.list` | v2 models | 无 | location:object? | `无` | 200:array | 400:InvalidRequestError<br>401:UnauthorizedError<br>503:ServiceUnavailableError |
| GET | `/api/provider` | `v2.provider.list` | v2 providers | 无 | location:object? | `无` | 200:array | 400:InvalidRequestError<br>401:UnauthorizedError<br>503:ServiceUnavailableError |
| GET | `/api/provider/{providerID}` | `v2.provider.get` | v2 providers | providerID:string! | location:object? | `无` | 200:ProviderV2Info | 400:InvalidRequestError<br>401:UnauthorizedError<br>404:ProviderNotFoundError<br>503:ServiceUnavailableError |
| POST | `/tui/append-prompt` | `tui.appendPrompt` | tui | 无 | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/tui/open-help` | `tui.openHelp` | tui | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| POST | `/tui/open-sessions` | `tui.openSessions` | tui | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| POST | `/tui/open-themes` | `tui.openThemes` | tui | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| POST | `/tui/open-models` | `tui.openModels` | tui | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| POST | `/tui/submit-prompt` | `tui.submitPrompt` | tui | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| POST | `/tui/clear-prompt` | `tui.clearPrompt` | tui | 无 | directory:string?, workspace:string? | `无` | 200:boolean | 400:BadRequestError |
| POST | `/tui/execute-command` | `tui.executeCommand` | tui | 无 | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/tui/show-toast` | `tui.showToast` | tui | 无 | directory:string?, workspace:string? | `object` | 200:boolean | 400:BadRequestError |
| POST | `/tui/publish` | `tui.publish` | tui | 无 | directory:string?, workspace:string? | `anyOf(EventTuiPromptAppend \| EventTuiCommandExecute \| EventTuiToastShow \| EventTuiSessionSelect)` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/tui/select-session` | `tui.selectSession` | tui | 无 | directory:string?, workspace:string? | `object` | 200:boolean | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError)<br>404:NotFoundError |
| GET | `/tui/control/next` | `tui.control.next` | tui | 无 | directory:string?, workspace:string? | `无` | 200:object | 400:BadRequestError |
| POST | `/tui/control/response` | `tui.control.response` | tui | 无 | directory:string?, workspace:string? | `{}` | 200:boolean | 400:BadRequestError |
| GET | `/experimental/workspace/adapter` | `experimental.workspace.adapter.list` | workspace | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| GET | `/experimental/workspace` | `experimental.workspace.list` | workspace | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| POST | `/experimental/workspace` | `experimental.workspace.create` | workspace | 无 | directory:string?, workspace:string? | `object` | 200:Workspace | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/experimental/workspace/sync-list` | `experimental.workspace.syncList` | workspace | 无 | directory:string?, workspace:string? | `无` | 204:无 | 400:BadRequestError |
| GET | `/experimental/workspace/status` | `experimental.workspace.status` | workspace | 无 | directory:string?, workspace:string? | `无` | 200:array | 400:BadRequestError |
| DELETE | `/experimental/workspace/{id}` | `experimental.workspace.remove` | workspace | id:string! | directory:string?, workspace:string? | `无` | 200:Workspace | 400:anyOf(effect_HttpApiError_BadRequest \| InvalidRequestError) |
| POST | `/experimental/workspace/warp` | `experimental.workspace.warp` | workspace | 无 | directory:string?, workspace:string? | `object` | 204:无 | 400:anyOf(WorkspaceWarpError \| VcsApplyError \| InvalidRequestError)<br>404:NotFoundError |
| GET | `/pty/{ptyID}/connect` | `pty.connect` | pty | ptyID:string! | directory:string?, workspace:string? | `无` | 200:boolean | 403:effect_HttpApiError_Forbidden<br>404:NotFoundError |

## Component Schemas

| Schema | 形态 |
|---|---|
| `AccountV2ApiKeyCredential` | object {type, key, metadata} |
| `AccountV2Credential` | anyOf |
| `AccountV2Info` | object {id, serviceID, description, credential} |
| `AccountV2OAuthCredential` | object {type, refresh, access, expires} |
| `Agent` | object {name, description, mode, native, hidden, topP, temperature, color, permission, model, variant, prompt, options, steps} |
| `AgentConfig` | object {model, variant, temperature, top_p, prompt, tools, disable, description, mode, hidden, options, color, steps, maxSteps, permission} |
| `AgentPart` | object {id, sessionID, messageID, type, name, source} |
| `AgentPartInput` | object {id, type, name, source} |
| `ApiAuth` | object {type, key, metadata} |
| `APIError` | object {name, data} |
| `AssistantMessage` | object {id, sessionID, role, time, error, parentID, modelID, providerID, mode, agent, path, summary, cost, tokens, structured, variant, finish} |
| `AttachmentConfig` | object {image} |
| `Auth` | anyOf |
| `BadRequestError` | object {name, data} |
| `Command` | object {name, description, agent, model, source, template, subtask, hints} |
| `CompactionPart` | object {id, sessionID, messageID, type, auto, overflow, tail_start_id} |
| `Config` | object {$schema, shell, logLevel, server, command, skills, reference, watcher, snapshot, plugin, share, autoshare, autoupdate, disabled_providers, enabled_providers, model, small_model, default_agent, username, mode, agent, provider, mcp, formatter, lsp, instructions, layout, permission, tools, attachment, enterprise, tool_output, compaction, experimental} |
| `ConsoleState` | object {consoleManagedProviders, activeOrgName, switchableOrgCount} |
| `ContextOverflowError` | object {name, data} |
| `effect_HttpApiError_BadRequest` | object {_tag} |
| `effect_HttpApiError_Forbidden` | object {_tag} |
| `effect_HttpApiError_InternalServerError` | object {_tag} |
| `Event` | anyOf |
| `Event.tui.command.execute` | object {id, type, properties} |
| `Event.tui.prompt.append` | object {id, type, properties} |
| `Event.tui.session.select` | object {id, type, properties} |
| `Event.tui.toast.show` | object {id, type, properties} |
| `EventAccountAdded` | object {id, type, properties} |
| `EventAccountRemoved` | object {id, type, properties} |
| `EventAccountSwitched` | object {id, type, properties} |
| `EventCatalogModelUpdated` | object {id, type, properties} |
| `EventCommandExecuted` | object {id, type, properties} |
| `EventFileEdited` | object {id, type, properties} |
| `EventFileWatcherUpdated` | object {id, type, properties} |
| `EventGlobalDisposed` | object {id, type, properties} |
| `EventInstallationUpdate-available` | object {id, type, properties} |
| `EventInstallationUpdated` | object {id, type, properties} |
| `EventLspClientDiagnostics` | object {id, type, properties} |
| `EventLspUpdated` | object {id, type, properties} |
| `EventMcpBrowserOpenFailed` | object {id, type, properties} |
| `EventMcpToolsChanged` | object {id, type, properties} |
| `EventMessagePartDelta` | object {id, type, properties} |
| `EventMessagePartRemoved` | object {id, type, properties} |
| `EventMessagePartUpdated` | object {id, type, properties} |
| `EventMessageRemoved` | object {id, type, properties} |
| `EventMessageUpdated` | object {id, type, properties} |
| `EventModels-devRefreshed` | object {id, type, properties} |
| `EventPermissionAsked` | object {id, type, properties} |
| `EventPermissionReplied` | object {id, type, properties} |
| `EventProjectUpdated` | object {id, type, properties} |
| `EventPtyCreated` | object {id, type, properties} |
| `EventPtyDeleted` | object {id, type, properties} |
| `EventPtyExited` | object {id, type, properties} |
| `EventPtyUpdated` | object {id, type, properties} |
| `EventQuestionAsked` | object {id, type, properties} |
| `EventQuestionRejected` | object {id, type, properties} |
| `EventQuestionReplied` | object {id, type, properties} |
| `EventServerConnected` | object {id, type, properties} |
| `EventServerInstanceDisposed` | object {id, type, properties} |
| `EventSessionCompacted` | object {id, type, properties} |
| `EventSessionCreated` | object {id, type, properties} |
| `EventSessionDeleted` | object {id, type, properties} |
| `EventSessionDiff` | object {id, type, properties} |
| `EventSessionError` | object {id, type, properties} |
| `EventSessionIdle` | object {id, type, properties} |
| `EventSessionNextAgentSwitched` | object {id, type, properties} |
| `EventSessionNextCompactionDelta` | object {id, type, properties} |
| `EventSessionNextCompactionEnded` | object {id, type, properties} |
| `EventSessionNextCompactionStarted` | object {id, type, properties} |
| `EventSessionNextModelSwitched` | object {id, type, properties} |
| `EventSessionNextPrompted` | object {id, type, properties} |
| `EventSessionNextReasoningDelta` | object {id, type, properties} |
| `EventSessionNextReasoningEnded` | object {id, type, properties} |
| `EventSessionNextReasoningStarted` | object {id, type, properties} |
| `EventSessionNextRetried` | object {id, type, properties} |
| `EventSessionNextShellEnded` | object {id, type, properties} |
| `EventSessionNextShellStarted` | object {id, type, properties} |
| `EventSessionNextStepEnded` | object {id, type, properties} |
| `EventSessionNextStepFailed` | object {id, type, properties} |
| `EventSessionNextStepStarted` | object {id, type, properties} |
| `EventSessionNextSynthetic` | object {id, type, properties} |
| `EventSessionNextTextDelta` | object {id, type, properties} |
| `EventSessionNextTextEnded` | object {id, type, properties} |
| `EventSessionNextTextStarted` | object {id, type, properties} |
| `EventSessionNextToolCalled` | object {id, type, properties} |
| `EventSessionNextToolFailed` | object {id, type, properties} |
| `EventSessionNextToolInputDelta` | object {id, type, properties} |
| `EventSessionNextToolInputEnded` | object {id, type, properties} |
| `EventSessionNextToolInputStarted` | object {id, type, properties} |
| `EventSessionNextToolProgress` | object {id, type, properties} |
| `EventSessionNextToolSuccess` | object {id, type, properties} |
| `EventSessionStatus` | object {id, type, properties} |
| `EventSessionUpdated` | object {id, type, properties} |
| `EventTodoUpdated` | object {id, type, properties} |
| `EventTuiCommandExecute` | object {type, properties} |
| `EventTuiPromptAppend` | object {type, properties} |
| `EventTuiSessionSelect` | object {type, properties} |
| `EventTuiToastShow` | object {type, properties} |
| `EventTuiToastShow1` | object {id, type, properties} |
| `EventVcsBranchUpdated` | object {id, type, properties} |
| `EventWorkspaceFailed` | object {id, type, properties} |
| `EventWorkspaceReady` | object {id, type, properties} |
| `EventWorkspaceStatus` | object {id, type, properties} |
| `EventWorktreeFailed` | object {id, type, properties} |
| `EventWorktreeReady` | object {id, type, properties} |
| `File` | object {path, added, removed, status} |
| `FileContent` | object {type, content, diff, patch, encoding, mimeType} |
| `FileNode` | object {name, path, absolute, type, ignored} |
| `FilePart` | object {id, sessionID, messageID, type, mime, filename, url, source} |
| `FilePartInput` | object {id, type, mime, filename, url, source} |
| `FilePartSource` | anyOf |
| `FilePartSourceText` | object {value, start, end} |
| `FileSource` | object {text, type, path} |
| `FormatterStatus` | object {name, extensions, enabled} |
| `GlobalEvent` | object {directory, project, workspace, payload} |
| `GlobalSession` | object {id, slug, projectID, workspaceID, directory, path, parentID, summary, cost, tokens, share, title, agent, model, version, time, permission, revert, project} |
| `ImageAttachmentConfig` | object {auto_resize, max_width, max_height, max_base64_bytes} |
| `InvalidCursorError` | object {_tag, message} |
| `InvalidRequestError` | object {_tag, message, kind, field} |
| `JSONSchema` | object |
| `LayoutConfig` | string |
| `LogLevel` | string |
| `LSPStatus` | object {id, name, root, status} |
| `McpLocalConfig` | object {type, command, environment, enabled, timeout} |
| `McpOAuthConfig` | object {clientId, clientSecret, scope, callbackPort, redirectUri} |
| `McpRemoteConfig` | object {type, url, enabled, headers, oauth, timeout} |
| `McpResource` | object {name, uri, description, mimeType, client} |
| `McpServerNotFoundError` | object {_tag, name, message} |
| `MCPStatus` | anyOf |
| `MCPStatusConnected` | object {status} |
| `MCPStatusDisabled` | object {status} |
| `MCPStatusFailed` | object {status, error} |
| `MCPStatusNeedsAuth` | object {status} |
| `MCPStatusNeedsClientRegistration` | object {status, error} |
| `McpUnsupportedOAuthError` | object {error} |
| `Message` | anyOf |
| `MessageAbortedError` | object {name, data} |
| `MessageOutputLengthError` | object {name, data} |
| `Model` | object {id, providerID, api, name, family, capabilities, cost, limit, status, options, headers, release_date, variants} |
| `ModelV2Info` | object {id, apiID, providerID, family, name, endpoint, capabilities, options, variants, time, cost, status, enabled, limit} |
| `ModelV2Info1` | object {id, apiID, providerID, family, name, endpoint, capabilities, options, variants, time, cost, status, enabled, limit} |
| `NotFoundError` | object {name, data} |
| `OAuth` | object {type, refresh, access, expires, accountId, enterpriseUrl} |
| `OutputFormat` | anyOf |
| `OutputFormatJsonSchema` | object {type, schema, retryCount} |
| `OutputFormatText` | object {type} |
| `Part` | anyOf |
| `PatchPart` | object {id, sessionID, messageID, type, hash, files} |
| `Path` | object {home, state, config, worktree, directory} |
| `PermissionAction` | string |
| `PermissionActionConfig` | string |
| `PermissionConfig` | anyOf |
| `PermissionNotFoundError` | object {_tag, requestID, message} |
| `PermissionObjectConfig` | object |
| `PermissionRequest` | object {id, sessionID, permission, patterns, metadata, always, tool} |
| `PermissionRule` | object {permission, pattern, action} |
| `PermissionRuleConfig` | anyOf |
| `PermissionRuleset` | array |
| `Project` | object {id, worktree, vcs, name, icon, commands, time, sandboxes} |
| `ProjectNotFoundError` | object {_tag, projectID, message} |
| `ProjectSummary` | object {id, name, worktree} |
| `Prompt` | object {text, files, agents, references} |
| `PromptAgentAttachment` | object {name, source} |
| `PromptFileAttachment` | object {uri, mime, name, description, source} |
| `PromptReferenceAttachment` | object {name, kind, uri, repository, branch, target, targetUri, problem, source} |
| `PromptSource` | object {start, end, text} |
| `Provider` | object {id, name, source, env, key, options, models} |
| `ProviderAuthAuthorization` | object {url, method, instructions} |
| `ProviderAuthError` | object {name, data} |
| `ProviderAuthError1` | object {name, data} |
| `ProviderAuthMethod` | object {type, label, prompts} |
| `ProviderConfig` | object {api, name, env, id, npm, whitelist, blacklist, options, models} |
| `ProviderNotFoundError` | object {_tag, providerID, message} |
| `ProviderV2Info` | object {id, name, enabled, env, endpoint, options} |
| `Pty` | object {id, title, command, args, cwd, status, pid} |
| `PtyForbiddenError` | object {_tag, message} |
| `PtyNotFoundError` | object {_tag, ptyID, message} |
| `QuestionAnswer` | array |
| `QuestionInfo` | object {question, header, options, multiple, custom} |
| `QuestionNotFoundError` | object {_tag, requestID, message} |
| `QuestionOption` | object {label, description} |
| `QuestionRejected` | object {sessionID, requestID} |
| `QuestionReplied` | object {sessionID, requestID, answers} |
| `QuestionRequest` | object {id, sessionID, questions, tool} |
| `QuestionTool` | object {messageID, callID} |
| `Range` | object {start, end} |
| `ReasoningPart` | object {id, sessionID, messageID, type, text, metadata, time} |
| `ReferenceConfig` | object |
| `ReferenceConfigEntry` | anyOf |
| `ResourceSource` | object {text, type, clientName, uri} |
| `RetryPart` | object {id, sessionID, messageID, type, attempt, error, time} |
| `ServerConfig` | object {port, hostname, mdns, mdnsDomain, cors} |
| `ServiceUnavailableError` | object {_tag, message, service} |
| `Session` | object {id, slug, projectID, workspaceID, directory, path, parentID, summary, cost, tokens, share, title, agent, model, version, time, permission, revert} |
| `SessionBusyError` | object {_tag, sessionID, message} |
| `SessionDelivery` | string |
| `SessionErrorUnknown` | object {type, message} |
| `SessionInfo` | object {id, parentID, projectID, workspaceID, path, agent, model, cost, tokens, time, title} |
| `SessionMessage` | anyOf |
| `SessionMessageAgentSwitched` | object {id, metadata, time, type, agent} |
| `SessionMessageAssistant` | object {id, metadata, time, type, agent, model, content, snapshot, finish, cost, tokens, error} |
| `SessionMessageAssistantReasoning` | object {type, id, text} |
| `SessionMessageAssistantText` | object {type, text} |
| `SessionMessageAssistantTool` | object {type, id, name, provider, state, time} |
| `SessionMessageCompaction` | object {type, reason, summary, include, id, metadata, time} |
| `SessionMessageModelSwitched` | object {id, metadata, time, type, model} |
| `SessionMessageShell` | object {id, metadata, time, type, callID, command, output} |
| `SessionMessageSynthetic` | object {id, metadata, time, sessionID, text, type} |
| `SessionMessageToolStateCompleted` | object {status, input, attachments, content, structured} |
| `SessionMessageToolStateError` | object {status, input, content, structured, error} |
| `SessionMessageToolStatePending` | object {status, input} |
| `SessionMessageToolStateRunning` | object {status, input, structured, content} |
| `SessionMessageUser` | object {id, metadata, time, text, files, agents, references, type} |
| `SessionNextRetry_error` | object {message, statusCode, isRetryable, responseHeaders, responseBody, metadata} |
| `SessionNotFoundError` | object {_tag, sessionID, message} |
| `SessionStatus` | anyOf |
| `SnapshotFileDiff` | object {file, patch, additions, deletions, status} |
| `SnapshotPart` | object {id, sessionID, messageID, type, snapshot} |
| `StepFinishPart` | object {id, sessionID, messageID, type, reason, snapshot, cost, tokens} |
| `StepStartPart` | object {id, sessionID, messageID, type, snapshot} |
| `StructuredOutputError` | object {name, data} |
| `SubtaskPart` | object {id, sessionID, messageID, type, prompt, description, agent, model, command} |
| `SubtaskPartInput` | object {id, type, prompt, description, agent, model, command} |
| `Symbol` | object {name, kind, location} |
| `SymbolSource` | object {text, type, path, range, name, kind} |
| `SyncEventMessagePartRemoved` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventMessagePartUpdated` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventMessageRemoved` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventMessageUpdated` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionCreated` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionDeleted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextAgentSwitched` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextCompactionDelta` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextCompactionEnded` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextCompactionStarted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextModelSwitched` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextPrompted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextReasoningDelta` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextReasoningEnded` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextReasoningStarted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextRetried` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextShellEnded` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextShellStarted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextStepEnded` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextStepFailed` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextStepStarted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextSynthetic` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextTextDelta` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextTextEnded` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextTextStarted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextToolCalled` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextToolFailed` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextToolInputDelta` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextToolInputEnded` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextToolInputStarted` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextToolProgress` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionNextToolSuccess` | object {type, name, id, seq, aggregateID, data} |
| `SyncEventSessionUpdated` | object {type, name, id, seq, aggregateID, data} |
| `TextPart` | object {id, sessionID, messageID, type, text, synthetic, ignored, time, metadata} |
| `TextPartInput` | object {id, type, text, synthetic, ignored, time, metadata} |
| `Todo` | object {content, status, priority} |
| `ToolFileContent` | object {type, uri, mime, name} |
| `ToolIDs` | array |
| `ToolList` | array |
| `ToolListItem` | object {id, description, parameters} |
| `ToolPart` | object {id, sessionID, messageID, type, callID, tool, state, metadata} |
| `ToolState` | anyOf |
| `ToolStateCompleted` | object {status, input, output, title, metadata, time, attachments} |
| `ToolStateError` | object {status, input, error, metadata, time} |
| `ToolStatePending` | object {status, input, raw} |
| `ToolStateRunning` | object {status, input, title, metadata, time} |
| `ToolTextContent` | object {type, text} |
| `UnauthorizedError` | object {_tag, message} |
| `UnknownError` | object {name, data} |
| `UnknownError1` | object {_tag, message, ref} |
| `UserMessage` | object {id, sessionID, role, time, format, summary, agent, model, system, tools} |
| `V2SessionMessagesResponse` | object {items, cursor} |
| `V2SessionsResponse` | object {items, cursor} |
| `VcsApplyError` | object {name, data} |
| `VcsFileDiff` | object {file, patch, additions, deletions, status} |
| `VcsFileStatus` | object {file, additions, deletions, status} |
| `VcsInfo` | object {branch, default_branch} |
| `WellKnownAuth` | object {type, key, token} |
| `Workspace` | object {id, type, name, branch, directory, extra, projectID, timeUsed} |
| `WorkspaceWarpError` | object {name, data} |
| `Worktree` | object {name, branch, directory} |
| `WorktreeCreateInput` | object {name, startCommand} |
| `WorktreeError` | object {name, data} |
| `WorktreeRemoveInput` | object {directory} |
| `WorktreeResetInput` | object {directory} |
