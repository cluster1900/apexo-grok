# testing/ 目录规范

存放 **超出 `cargo test` 自动化范围** 的测试制品：提交前必跑清单、各类测试用例库、手工 / 联调测试报告、对抗性测试记录、性能基准、Prompt 回归报告、模糊测试报告。

> 测试 **代码** 留在 `crates/*/tests/`、`tests/`、`fuzz/`；本目录只收纳 **清单、用例、报告**。

## 1. 测试类型与必跑等级

每个功能提交 PR 前，下列 7 类测试缺一不可（确实不适用必须在 PR 描述里显式写"不适用 + 理由"，由 reviewer 判定是否放行）：

| 类型 | 目的 | 工具 / 位置 | 提交前 |
|---|---|---|---|
| **单元测试** | 单个函数 / 模块的逻辑正确性、值对象不变量、枚举分支 | `#[cfg(test)] mod tests` + `cargo test` | 必跑 |
| **场景测试**（scenario） | 用例编排层的关键路径，覆盖 application 层用例的"主流程 + 已知分支" | `crates/*/tests/scenario_*.rs` + `rstest` / `insta` | 必跑 |
| **功能完整性测试**（functional） | 对照 `development/<feature>/功能设计.md` 的"目标与非目标"逐条验证 | `crates/*/tests/functional_*.rs`，必要时手工补充 | 必跑 |
| **E2E 测试** | 从 CLI 入口或 HTTP 入口起跑，包含真实子进程、文件系统、Provider mock / 录像回放 | `tests/e2e/` + `assert_cmd` / `expectrl` / 录像回放 | 必跑 |
| **模糊测试**（fuzz） | 输入解析、配置加载、Tool 协议反序列化、Prompt 拼装、MCP 帧等边界鲁棒性 | `fuzz/` + `cargo-fuzz` / `proptest` | **新增 / 修改输入入口**时必跑（≥30 分钟或语料足够覆盖） |
| **对抗性测试** | coding agent 安全边界（见 §4） | 用例库 `adversarial-cases.md` + 脚本化 / 手工 | **改动安全敏感面**时必跑 |
| **Agent Eval** | agent 行为质量：轨迹正确性、工具使用准确度、grounding、cost / latency 预算 | 用例库 `evals/` + 录像回放 + LLM-as-judge | **触碰 agent 循环 / Tool / Provider / MCP / Session / Prompt** 时必跑 |

附加（视改动性质必跑）：

- **性能基准**：触碰热点路径、引入新依赖、改协议时。
- **Prompt 回归**：改动 `prompts/**` 任意资产时。
- **跨平台冒烟**：改动文件系统 / 进程 / 终端 IO 时，至少 macOS + Linux 各跑一次。

## 2. 目录结构

```text
testing/
├── README.md
├── critical-integration-tests.md   ← 提交前必跑清单（自增编号 CIT-NNNN）
├── adversarial-cases.md            ← 对抗性测试用例库
├── fuzz-corpus.md                  ← 模糊测试目标 / 语料 / 触发命令清单
├── e2e/                            ← E2E 用例与录像回放说明
│   └── README.md
├── evals/                          ← Agent Eval 用例库与基线
│   ├── README.md
│   ├── trajectories/               ← golden trajectory 用例
│   ├── tool-use/                   ← 工具使用准确度用例
│   ├── judge/                      ← LLM-as-judge rubric 与样本
│   └── baselines/                  ← 各 release 的基线指标
├── prompt-regression/              ← Prompt 回归报告
│   └── <agent>_<prompt-version>_YYYY-MM-DD.md
├── performance/                    ← 性能基准
│   └── <scenario>_YYYY-MM-DD.md
└── <feature>/
    ├── 功能完整性测试_YYYY-MM-DD.md
    ├── 场景测试_YYYY-MM-DD.md
    ├── E2E测试_YYYY-MM-DD.md
    ├── 模糊测试_YYYY-MM-DD.md
    ├── Eval测试_YYYY-MM-DD.md
    └── 联调测试报告_YYYY-MM-DD.md
```

## 3. critical-integration-tests.md

整个仓库的"提交前必跑清单"。每条用例至少包含：

- **编号**：`CIT-NNNN` 自增。
- **类型**：单元 / 场景 / 功能完整性 / E2E / 模糊 / 对抗性 / 性能 / Prompt 回归。
- **名称**：简短描述。
- **触发命令**：可直接复制运行（`cargo test ...` / `cargo nextest run ...` / `cargo fuzz run ...` / 脚本路径）。
- **覆盖范围**：保护的功能 / 不变量。
- **预期结果**：断言点 + 通过判据（含覆盖率 / 时间 / 语料数阈值）。
- **关联 Issue / PR**：可选。

新增或修改 **核心链路**（CLI 主路径、Provider 调用、Tool 调用、Session 持久化、配置加载、Prompt 拼装等）必须同步更新本清单。

## 4. adversarial-cases.md

对抗性测试用例库，覆盖 coding agent 自身的安全边界：

- **Prompt 注入 / Jailbreak**：用户输入、工具输出回灌、文件 / 仓库内容夹带恶意指令。
- **工具滥用**：命令注入（shell metacharacter）、路径穿越（`../` / 软链）、网络越权（绕过白名单）、删除根目录类破坏。
- **工作区越权**：读写沙箱外路径、跨 session 串读、读未授权文件（`.ssh`、`.aws` 等）。
- **凭据泄漏**：日志 / Prompt / 错误信息 / Trace 中出现密钥、Token、cookie。
- **成本耗尽**：超长上下文、循环工具调用、模型档位绕过、强制使用最贵模型。
- **配置注入**：恶意配置、远程拉取的 Prompt 资产、不受信 plugin / MCP server。
- **失败注入**：Provider 超时 / 限流 / 5xx、磁盘满、SIGPIPE、Ctrl+C 中断、断网。
- **协议畸形**：Tool 协议 / SSE / JSON-RPC 收到畸形帧时不应 panic / 不应越权。

每条用例必须能 **手工或脚本化复现**，并附至少一次实际验证记录。

## 5. fuzz-corpus.md

模糊测试目录清单：

- 每个 fuzz target 一行：target 名 / 入口函数 / 触发命令 / 当前语料规模 / 最近一次跑的时长与崩溃数。
- 新增解析逻辑（配置、协议、序列化）必须新增对应 fuzz target，并在本文件登记。
- 触发命令必须可直接复制运行，例如：
  ```bash
  cargo fuzz run config_loader -- -max_total_time=1800
  ```
- 历史发现的崩溃用例归档到 `fuzz/corpus/<target>/` 并在本文件给出来源说明。

## 6. 各类测试报告模板

### 6.1 功能完整性测试报告

```markdown
# <功能> 功能完整性测试 — YYYY-MM-DD

- **对照**：development/<feature>/功能设计.md（指明版本 / commit）
- **测试人**：
- **环境**：OS / Rust 版本 / 二进制 hash / 配置 hash

## 目标对照表
| 目标编号 | 描述 | 测试用例 | 结果 | 备注 |
|---|---|---|---|---|

## 非目标确认
列出"明确不做"的项，验证当前实现没有越界。

## 缺陷
逐条关联 Issue。

## 结论
是否满足功能完整性。
```

### 6.2 场景测试报告

按 application 层用例的主流程 + 已知分支组织：

- 列出每个场景的输入序列、预期状态转移、断言点。
- 报告中给出实际跑出的结果（通过 / 失败 / 跳过）与日志摘录。

### 6.3 E2E 测试报告

```markdown
# <功能> E2E 测试 — YYYY-MM-DD

- **运行方式**：本地 / CI / 录像回放
- **覆盖入口**：CLI / HTTP / TUI
- **Provider 处理**：真实调用 / mock / 录像回放（注明语料来源）

## 用例清单
| 编号 | 入口命令 / 请求 | 步骤 | 期望终态 | 实际结果 |
|---|---|---|---|---|

## 失败用例分析
关联 Issue。

## 结论
```

### 6.4 模糊测试报告

```markdown
# <功能> 模糊测试 — YYYY-MM-DD

- **Target**：<fuzz target 名>
- **触发命令**：
- **运行时长**：
- **语料规模**：起始 N → 结束 M
- **崩溃数**：
- **新增覆盖**：与上次基线对比

## 崩溃样本
每个崩溃：输入摘要 / 栈 / 根因 / 修复 PR。

## 结论
是否可放行。
```

### 6.5 Agent Eval 报告

涉及 agent 循环 / Tool / Provider / MCP / Session / Prompt 的改动必须出 eval 报告，命名 `<feature>/Eval测试_YYYY-MM-DD.md`：

```markdown
# <功能> Agent Eval — YYYY-MM-DD

- **基线对比**：与 baselines/<release>.json 对比
- **模型**：实际使用的 provider + 模型 ID
- **样本来源**：evals/trajectories/<...> / tool-use/<...> / judge/<...>

## Trajectory
| 编号 | 任务描述 | 预期工具序列 | 实际工具序列 | 关键中间事件断言 | 终态断言 | 结果 |
|---|---|---|---|---|---|---|

## Tool-use accuracy
- 样本数 / 工具选择正确率 / 参数 schema 通过率 / 平均轮次。

## LLM-as-judge
- 评判模型 / Rubric 路径 / 分数分布 / 通过门槛。

## Grounding
- 每条回答的依据可溯源率；无凭据声明的样本数。

## Cost / Latency
- 每条用例 input/output token、prompt cache 命中率、wallclock；与预算上限对比。

## 与基线对比
- 关键指标差值与百分比；回退 >5% 必须说明原因或回滚。

## 结论
- 是否可合并；若不可，列出阻塞项。
```

### 6.6 联调测试报告

```markdown
# <功能> 联调测试 — YYYY-MM-DD

- **测试人**：
- **环境**：OS / Rust 版本 / 二进制版本 / 配置 hash / 外部依赖版本
- **范围**：本次覆盖了哪些用例（含编号引用 critical-integration-tests.md）
- **结果**：表格列每条用例的通过 / 失败 / 跳过
- **缺陷**：每个失败用例关联 Issue
- **结论**：是否准许发布 / 进入下一阶段
```

## 7. Prompt 回归

任何 `prompts/**` 资产修改必须出回归报告，命名 `prompt-regression/<agent>_<prompt-version>_YYYY-MM-DD.md`：

- 对照旧版本与新版本各跑 ≥10 条样本。
- 断言点 **只断结构化字段**（JSON path / schema 形状），不断自由文本字面量。
- 列出语义层面的人工判定差异，标 better / equal / worse。
- 给出是否准许替换旧版本的结论。

## 8. 性能基准

引入性能优化 / 怀疑性能回退 / 切换关键依赖时出报告，命名 `performance/<scenario>_YYYY-MM-DD.md`：

- 复现命令、硬件、并发参数。
- 指标：P50/P95/P99、吞吐、内存峰值、首 token 时间、二进制大小。
- 与上一次基线对比，列差值与百分比。
- 优化项的归因分析。

## 9. 与其它目录的关系

- `development/<feature>/测试矩阵.md` 是计划，本目录是执行结果与用例库。
- 对抗性用例若推动了架构改动，关联 `architecture/<component>/决策记录/`。
- 性能基准如导致依赖切换，关联调研 `research/<topic>/`。
- 提交前必跑结果未通过的 PR 不予合并；豁免必须在 PR 描述写明理由并经 reviewer 同意。
