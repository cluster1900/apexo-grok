# architecture/ 目录规范

存放 **opencode-rs 当前真实生效** 的架构设计文档。架构指代码已经落地、或即将落地（已开 PR/进入开发）的边界与契约；停留在脑暴阶段的方案应放在 `docs/research/`，不要塞进本目录。

## 1. 适用范围

下列变化必须先改本目录文档、再改代码：

- 限界上下文（bounded context）划分或重命名。
- 通用语言（ubiquitous language）核心概念新增 / 改名 / 弃用。
- 聚合根（aggregate root）边界、不变量、所属上下文调整。
- crate / workspace 拓扑变化（新增 crate、合并、对外可见性调整）。
- 对外契约：CLI 子命令、TUI 协议、HTTP/RPC 接口、配置 schema、Provider/Tool 协议。
- 部署形态：单二进制、子进程、守护进程模式切换。
- 跨上下文通信方式（领域事件、ACL、共享 kernel）。

## 2. 目录结构

```text
architecture/
├── README.md                ← 本文件
├── overview.md              ← 系统全局视图（必有，单文件）
├── context-map.md           ← 限界上下文图（多上下文出现后必须维护）
├── ubiquitous-language.md   ← 通用语言术语表（出现 ≥2 个核心概念后必须维护）
├── events.md                ← 领域事件 schema 登记（有事件后必维护）
├── slo.md                   ← SLO 指标（首 token p95 / 总延迟 / 工具成功率 等）
├── observability.md         ← Trace / Metrics / 日志字段约定，含 OTel `gen_ai.*` 语义约定
└── <component>/             ← 每个组件 / 上下文一个子目录
    ├── 架构设计.md           ← 必有
    ├── 数据流.md             ← 涉及状态机 / 数据管道时
    └── 决策记录/             ← ADR 形式记录关键取舍，命名 NNNN-标题.md
```

- `<component>` 用英文小写短横线，对应代码中的 crate 名或模块名。
- 单组件只写一个 `架构设计.md`，超出后按主题拆 `数据流.md` / `错误模型.md` / `扩展点.md`，不要无主题堆叠。

### 2.1 agent 预期组件清单

opencode-rs 作为现代 coding agent，下列组件出现即必须建对应子目录：

| 子目录 | 范围 | 必须文档化 |
|---|---|---|
| `session-and-agent` | Session、Message、Part、Agent、Prompt、Processor、Subagent | 会话聚合、消息/part 状态机、agent profile、prompt/summary/compaction、revert/share/todo |
| `tool-execution` | 内置 Tool、插件 Tool、MCP Tool、权限与输出截断 | tool schema、权限等级、执行结果、workspace 安全、dynamic registry |
| `provider-and-model` | Provider、Model、认证、流式 LLM | catalog 合并、model capability/cost/status、auth/OAuth、streaming 错误 |
| `project-workspace` | Project、Workspace、VCS、File、LSP | workspace root、路径校验、git/worktree、file/search/watcher、LSP |
| `configuration` | Config schema、加载链、迁移 | 默认值、文件/env/CLI 覆盖、remote/managed config、secret 规则 |
| `mcp-and-plugin` | MCP server、Plugin runtime、TUI plugin | local/remote transport、OAuth、hook、tool/provider/workspace adapter、隔离 |
| `interface-cli-http` | CLI/TUI、HTTP/SSE/WS、OpenAPI/SDK | CLI 命令、HTTP endpoints、SSE events、PTY WS、auth/CORS/workspace routing |
| `desktop-webjs` | Electron/WebJS desktop shell | sidecar IPC、preload API、native picker/clipboard/updater/deeplink、Web UI |
| `storage-sync` | SQLite、migration、sync event、projector | 表结构、event seq、replay/history、share sync、migration progress |
| `deployment-and-distribution` | install、CI/CD、Nix、container、release、patches | 平台 target、artifact、installer、签名、公证、发布/回滚、CI 镜像 |
| `external-integrations` | GitHub Action、VS Code、Zed、Slack、ACP、SDK consumers | webhook/comment/editor command、外部身份、引用解析、幂等回复 |
| `cloud-console-stats` | Console、Stats、Enterprise、Function、SST infra | share/usage/account/API key/billing/stats lake/secret/stage |
| `prompt-assets-and-repo-config` | `.opencode` agent/command/skill/tool/theme/glossary、prompt 资产 | 资产版本、repo-local 加载、Prompt 回归、自定义 tool 安全 |
| `shared-libraries` | `packages/core`、`packages/llm`、`http-recorder`、scripts、v2 specs | schema kernel、provider protocol、record/replay、plugin hooks、codegen |


组件未开始实现时无需提前建空目录；进入开发即建。

## 3. 写作要求

每份 `架构设计.md` 至少包含以下章节（小节缺省时显式写"无"，不要省略）：

1. **职责与边界**：本组件负责什么、不负责什么、与上下游的边界在哪里。
2. **核心概念**：列出本组件涉及的聚合根 / 实体 / 值对象 / 领域服务，并与 `ubiquitous-language.md` 对齐。
3. **模块拓扑**：分层（domain / application / infrastructure / interface）下的关键模块、依赖方向（禁反向）。
4. **对外契约**：trait、crate 公开 API、CLI/HTTP 接口、事件 schema，含版本。
5. **关键不变量**：必须始终满足的约束，对应的强制点（构造函数 / 方法 / 测试）。
6. **错误模型**：本组件向上抛什么错误类型、哪些是可重试、哪些是可预期业务失败。
7. **扩展点**：第三方可插拔的位置（Provider、Tool、Format 等）与扩展约定。
8. **未决问题**：明确列出"还没想清楚"的点，避免读者误以为已收敛。

注释规范见 `AGENTS.md`；本目录文档不重复写代码细节，**只描述边界与契约**。

## 4. ADR（架构决策记录）

- 当出现"两个以上方案需要取舍"或"颠覆既有设计"时，在对应 `<component>/决策记录/` 下新增 `NNNN-标题.md`（NNNN 自增四位序号）。
- 必含：背景、备选方案、决策、后果、关联 PR / Issue / 调研报告。
- 已采纳的 ADR 不删除；被取代时新增一篇并标注 "supersedes NNNN"。

## 5. 同步规则

- 文档与代码必须至少修正一侧。架构文档落后于代码视为缺陷，PR 描述需列出本次架构文档变更（或显式写"无架构影响"）。
- 概念 / 组件不再使用时，从对应文档中直接删除相关章节，不保留占位。git 历史已经记录变更轨迹。
