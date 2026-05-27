# development/ 目录规范

存放 **正在进行 / 即将进行** 的功能开发设计。一个功能 = 一个子目录，文档先行，代码后跟。

## 1. 何时新建

- 凡是会改动到对外契约、聚合边界、数据流、配置 schema、Provider/Tool 协议的功能，开工前必须先在本目录建子目录写设计。
- 豁免（开工后再补 `docs/progress/`）：hotfix、typo、纯重构（不改公开 API）、纯测试补充、构建脚本调整。

## 2. 目录结构

```text
development/
├── README.md
└── <feature>/                ← 英文小写短横线，与里程碑 / Issue 一致
    ├── 功能设计.md            ← 必有
    ├── 接口设计.md            ← 涉及对外接口（CLI / HTTP / Tool 协议 / 配置）时必有
    ├── 数据设计.md            ← 涉及持久化、文件格式、缓存结构时必有
    ├── 测试矩阵.md            ← 高风险或多分支功能必有
    └── 决策记录/              ← 功能内部取舍 ADR（架构级 ADR 放 architecture/）
```

每个文件控制在一个明确主题；超出再拆，不要在一个文件里堆"功能 + 接口 + 数据"。

## 3. 写作要求

### 3.1 功能设计.md 必含章节

1. **目标与非目标**：本次解决什么、不解决什么。
2. **背景**：调研结论 / 相关 Issue / 用户反馈（链接到 `docs/research/`）。
3. **领域模型**：本功能涉及的聚合根 / 实体 / 值对象 / 领域服务，是新建还是复用。
4. **用例编排**：application 层用例步骤、跨聚合协调点、领域事件发布订阅。
5. **关键 crate / trait 边界**：用 Rust 术语描述，标注新增 / 修改 / 复用。
6. **错误模型**：哪些是可预期业务失败（`Result<T, E>` 返回）、哪些是基础设施错误（`anyhow::Error` / 自定义 `thiserror`）。
7. **影响面**：影响到的现有功能 / 模块 / 文档清单。
8. **回滚方案**：上线后出问题怎么退。
9. **遗留问题**：故意没做的、待后续追踪的，连同 Issue 链接。

### 3.2 接口设计.md 必含章节

- **接口形态**：CLI 子命令 / HTTP / Tool 协议 / 配置项。
- **请求 / 响应 schema**：用 Rust 类型 + serde 注解描述；外部协议必须额外列 JSON Schema 或字段表（含类型、可选性、默认值、校验规则、错误码）。
- **错误码**：枚举所有可能的错误码 / 错误类型，含触发场景。
- **兼容性**：是否破坏既有客户端、版本号策略、迁移建议。
- **示例**：至少一个成功 + 一个失败的请求 / 响应样例。

### 3.3 数据设计.md 必含章节

- **数据形态**：持久化结构（DB schema / 文件格式 / 缓存键）、内存结构（如长期态机）。
- **生命周期**：何时创建、更新、归档、删除；是否有 TTL。
- **索引与查询模式**：常见读路径与对应索引。
- **迁移脚本**：新表 / 字段 / 文件格式变更必带迁移与回滚脚本，脚本入 `docs/deployment/`。

### 3.4 测试矩阵.md 必含

- 单元测试覆盖到的不变量与分支。
- 场景测试（application 用例主流程 + 分支）。
- 功能完整性核对（对应 `功能设计.md` 的"目标与非目标"逐条映射到用例）。
- E2E 测试覆盖到的链路与入口（CLI / HTTP / TUI）。
- 模糊测试目标（输入解析、Tool 协议、Prompt 拼装、MCP 帧等）。
- 对抗性测试场景（参考 `AGENTS.md` §6 安全要点）。
- Prompt 资产回归用例（如改动到 Prompt）。
- Agent Eval（如涉及 agent 循环 / Tool / Provider / MCP / Session / Prompt）：trajectory、tool-use accuracy、LLM-as-judge、cost-latency 预算、基线指标。

### 3.5 Agent 类功能附加必含

涉及 agent 比如循环 / Tool / Provider / MCP / Session / 上下文工程 / Prompt/等等 的功能，**`功能设计.md` 必须额外包含**：

- **模型档位选择**：本功能用哪一档（cheap / standard / strong），依据是什么。
- **Tool 设计**（如新增或修改 Tool）：`name` / `description` / `input_schema` / `permission_level` / `idempotent` / `timeout` / `output_schema` / 失败语义。
- **Prompt 设计**：system 模板引用、上下文预算分项、cache 边界、对外部内容的 `<untrusted_input>` 包裹策略。
- **审批 / 权限**：本功能涉及的权限级别（`read/write/execute/network/dangerous`）、用户审批触发点、dry-run 行为。
- **停止条件**：max_iterations、token / cost 预算、用户中断、超时；超限后的回退行为。
- **可观测**：本功能要新增 / 修改的 trace span、metrics、`gen_ai.*` 属性。
- **Eval 设计**：判定标准（结构化断言 / LLM-as-judge rubric）、判定主体、最小样本数、基线指标。

## 4. 与其它目录的关系

| 目录 | 关系 |
|---|---|
| `architecture/` | 架构定边界，development 在边界内细化实现 |
| `research/` | research 收敛后产出本目录设计 |
| `progress/` | 实现进度跟踪本目录功能的落地状态 |
| `testing/` | 测试报告引用本目录的测试矩阵 |
| `deployment/` | 上线 / 迁移脚本来自本目录数据设计 |

## 5. 完工后维护

功能上线 + `progress/` 标记完成后：

- 设计文档继续在本目录维护，与代码一同演进。
- 重大调整直接更新原文档；多次小修小补累计后，可在子目录追加 `变更履历.md` 记录关键节点。
- 若功能被永久移除：直接删除子目录，不留占位。
