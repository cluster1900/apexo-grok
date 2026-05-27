# 文档地图

本目录是 **opencode-rs**（opencode 的 Rust 移植）的设计、开发、测试与进度入口。文档按分类目录组织，再在分类目录下按功能划分。`AGENTS.md` 是仓库根的协作规范，本目录是其展开。

## 分类目录索引

| 目录 | 用途 | 规范 |
|---|---|---|
| [`architecture/`](architecture/README.md) | 当前真实生效的架构设计：限界上下文、聚合边界、模块拓扑、对外契约、ADR | [架构目录规范](architecture/README.md) |
| [`development/`](development/README.md) | 进行中 / 即将进行的功能设计：功能 / 接口 / 数据 / 测试矩阵 / 决策记录 | [开发目录规范](development/README.md) |
| [`progress/`](progress/README.md) | 每个功能的真实当前状态（与代码一同作为冲突仲裁者） | [进度目录规范](progress/README.md) |
| [`research/`](research/README.md) | 尚未收敛为设计的调研、对比、根因调查、上游源码笔记 | [调研目录规范](research/README.md) |
| [`testing/`](testing/README.md) | 提交前必跑清单、各类测试用例库与报告（单元 / 场景 / 功能完整性 / E2E / 模糊 / 对抗性 / 性能 / Prompt 回归） | [测试目录规范](testing/README.md) |
| [`deployment/`](deployment/README.md) | 构建 / 分发 / 运行时配置 / 迁移 / 应急 runbook | [部署目录规范](deployment/README.md) |

## 阅读顺序

接到任务时，按下列顺序拉齐上下文：

1. 仓库根 `AGENTS.md`：协作红线、Rust 工程实践、DDD 分层、安全边界、注释规范。
2. `docs/architecture/overview.md`：系统全局视图（如已建立）。
3. `docs/architecture/<相关组件>/架构设计.md`：组件边界与契约。
4. `docs/development/<相关功能>/功能设计.md` → `接口设计.md` → `数据设计.md`：功能内细节。
5. `docs/progress/<相关功能>/功能现状.md`：当前实际进度与已知偏差。
6. `docs/testing/critical-integration-tests.md`：提交前必跑清单。
7. `docs/research/<相关主题>/`：与本任务相关的历史调研。
8. `docs/deployment/runtime/配置说明.md`：运行环境与配置项。

## 目录结构（当前）

```text
docs/
├── README.md                  ← 本文件
├── architecture/
│   ├── README.md              ← 架构目录规范
│   ├── overview.md            ← Rust DDD 总览
│   ├── context-map.md         ← 限界上下文图
│   ├── ubiquitous-language.md ← 通用语言
│   └── <feature>/
├── development/
│   ├── README.md              ← 开发目录规范
│   └── <feature>/
├── progress/
│   ├── README.md              ← 进度目录规范
│   ├── overview.md
│   └── <feature>/
├── research/
│   ├── README.md              ← 调研目录规范
│   └── <feature>/
├── testing/
│   └── README.md              ← 测试目录规范
│   └── <feature>/
└── deployment/
    ├── README.md              ← 部署目录规范
    └── <feature>/
```

各分类下的具体子目录与文件命名、写作要求，详见对应规范。

## 通用维护规则

- **架构变化**：先更新 `architecture/<组件>/架构设计.md`，再改代码（豁免见各子规范）。
- **接口 / 配置变化**：同步更新 `development/<功能>/接口设计.md` + `progress/<功能>/功能现状.md`；若波及边界，回写 `architecture/`。
- **新功能**：开工前必须先做足够的调研并归档到 `docs/research/<主题>/`，调研结论 + 人类确认后才能进入 `docs/development/<功能>/` 设计与编码；不得跳过调研直接进入实现。
- **新功能落位**：必须在 `development/`、`progress/`、（涉及测试报告时）`testing/<功能>/` 各自建同名子目录，不要把多个功能挤在同一文件里。
- **冲突仲裁**：当文档与代码不一致，以代码 + `progress/` 为真；任务结束前必须修正其中一侧，否则不视为完成。
- **PR 描述** 必须列出本次涉及的文档变更清单（含"无"选项）。

## 命名约定

- 子目录使用英文小写短横线（如 `provider-anthropic`、`tool-bash`）。
- 文档文件名优先中文（如 `架构设计.md`、`功能现状.md`）；附日期的报告统一以 `_YYYY-MM-DD.md` 结尾。
- 同一功能在 `development/`、`progress/`、`testing/` 下的子目录名 **必须保持一致**，便于交叉跳转。
