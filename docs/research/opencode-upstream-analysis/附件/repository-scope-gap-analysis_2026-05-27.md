# 全仓范围缺口复核 — 2026-05-27

## 1. 复核结论

上一轮文档覆盖了 `packages/opencode` 主业务链路、HTTP/CLI/Tool/OpenAPI/SQLite、Desktop/WebJS 与主要外围包，但清单生成路径偏向 `packages/*/package.json` 和核心协议入口。因此它没有完整覆盖 `/Users/hawk_wu/Desktop/opencode` 的 root 级仓库资产、没有 `package.json` 的资源目录、CI/发布/部署脚本、Nix/容器分发、docs 站点源码、`.opencode` repo-local agent 资产，以及部分云端/扩展入口。

这些缺口不是 Rust agent core 的新增业务功能，但属于“上游完整迁移/保留兼容”的功能边界；架构与开发文档必须显式列入，否则后续实现容易只完成 CLI/HTTP/agent core 而漏掉产品化与生态入口。

## 2. 本次重新扫描的入口

| 范围 | 上游入口 | 上一轮状态 | 本次判定 |
|---|---|---|---|
| root monorepo 配置 | `package.json`、`turbo.json`、`bunfig.toml`、`patches/*` | 只在 package 清单侧面出现 | 必须纳入分发/构建架构；patched dependency 是兼容约束。 |
| 安装脚本 | `install` | 未入矩阵 | 必须纳入分发；包含 OS/arch、musl、AVX2 baseline、local binary、PATH 修改。 |
| Nix 打包 | `flake.nix`、`nix/*` | 未入矩阵 | 必须纳入分发；覆盖 CLI 与 desktop derivation。 |
| CI/发布 | `.github/workflows/*`、`.github/actions/*` | 未入矩阵 | 必须纳入部署/测试；覆盖 publish、beta、deploy、containers、nix、docs、stats、VS Code/GitHub Action 发布。 |
| CI 容器 | `packages/containers/*` | 未入 package 清单 | 必须纳入部署；Linux CI 镜像会影响 Rust/Tauri/WebJS 构建。 |
| SST/云基础设施 | `infra/*`、`sst.config.ts` | 只在 Console/Stats 中概括 | 必须纳入 cloud/部署；覆盖 console、enterprise、lake、monitoring、secret、stats stage。 |
| GitHub Action 产品 | `github/*` | 只在外围集成表粗略提到 | 必须纳入外部集成；包含 `/opencode`/`/oc` 触发、issue/PR/review comment、branch/PR/share。 |
| VS Code extension | `sdks/vscode/*` | 粗略提到 | 必须纳入外部集成；包含命令、快捷键、终端复用、选区和文件引用。 |
| Zed extension | `packages/extensions/zed/*` | 未入矩阵 | 必须纳入外部集成；包含 extension manifest、图标、同步脚本。 |
| docs 站点内容 | `packages/docs/*` | 未入 package 清单 | 必须纳入 docs/产品资产；含 quickstart、settings、AI tools、图片/logo。 |
| identity 资产 | `packages/identity/*` | 未入矩阵 | 必须纳入分发/品牌资产；桌面、文档、扩展和发布包共用。 |
| repo-local opencode 资产 | `.opencode/*` | 未入矩阵 | 必须纳入 prompt/assets；包含 agent、command、skills、themes、custom tools、glossary、TUI/plugin smoke。 |
| v2/core 规范 | `specs/*` | 未入矩阵 | 必须作为架构输入；包含 project API、v2 session/provider/model/instructions/todo。 |
| performance 基线 | `perf/test-suite.md`、`STATS.md` | 未入矩阵 | 必须纳入测试；作为性能/eval 基线输入。 |
| shared core package | `packages/core/*` | 被 provider/agent 文档吸收但不显式 | 必须单独纳入 shared libraries；是 v2 domain/schema/plugin hook 基线。 |
| llm package | `packages/llm/*` | 只在 Provider & Model 概括 | 必须单独纳入 shared libraries；包含 protocol/provider/route/tool runtime/recorded tests。 |
| http-recorder | `packages/http-recorder/*` | 未入矩阵 | 必须纳入测试基础设施；用于 provider/HTTP 录制回放、脱敏、WS。 |
| function package | `packages/function/*` | 未入矩阵 | 必须纳入 cloud/外部集成；GitHub App/JWT/Worker API。 |
| enterprise package | `packages/enterprise/*` | 未入矩阵 | 必须纳入 cloud/console；share/storage/routes/cloudflare build。 |

## 3. 原因定位

上一轮的自动附件中：

- `package-inventory.generated.md` 只覆盖 `packages/*` 下存在 `package.json` 的目录，天然漏掉 `packages/docs`、`packages/identity`、`packages/extensions/zed`、`packages/containers` 等资源/分发目录。
- HTTP/CLI/Tool/OpenAPI 统计以 agent runtime 协议为中心，不会发现 `.github`、`infra`、`nix`、`script`、`install`、`specs`、`perf`。
- 子 agent 对“外围集成”做了口头核对，但 `feature-coverage-matrix.md` 没有把所有外围入口展开到可追踪条目。
- 架构文档只有 9 个 agent runtime 上下文，缺少 repository/productization 维度，所以读者会看到“核心很完整，但全仓不完整”。

## 4. 文档修正要求

| 文档 | 修正 |
|---|---|
| `feature-coverage-matrix.md` | 增加 Repository/Productization、Shared Libraries、Cloud/Console、External Integrations、Prompt Assets 五组。 |
| `docs/architecture/README.md` | 增加预期组件：deployment-and-distribution、external-integrations、cloud-console-stats、prompt-assets-and-repo-config、shared-libraries。 |
| `docs/architecture/overview.md` | 在限界上下文、协议基线、迁移阶段中显式列入上述上下文。 |
| `docs/architecture/context-map.md` | 增加产品化/云端/外部集成/共享库与核心 application 的依赖关系。 |
| `docs/development/opencode-rust-webjs-port/*` | 目标、背景、影响面、接口、测试矩阵补齐上述范围。 |
| `docs/progress/opencode-rust-webjs-port/功能现状.md` | 记录本次完整性缺口已发现并回写。 |
| `docs/testing/opencode-rust-webjs-port/验证报告_2026-05-27.md` | 将原“已覆盖”改为“已补齐缺口后覆盖”，保留上一轮方法缺陷。 |

## 5. 后续实现阶段注意点

- `docs/architecture/` 只定义边界与契约，不代表所有上游 Web/云产品都要迁入 Rust core；需要区分 Rust core 必须实现、WebJS/TS 可保留、部署资产可复用三类。
- `.opencode` 下的 prompt/agent/skill/command/tool 资产不能硬编码进 Rust；应按 `prompts/` 与 repo-local asset loader 版本化迁移。
- `packages/core` 和 `packages/llm` 是上游正在推进的 v2 抽象，Rust 迁移不能只照旧 `packages/opencode`，要把 v2 specs 作为领域建模输入。
- GitHub Action、VS Code、Zed、Slack、Console/Stats/Enterprise 都是外部接口消费者；即使实现暂缓，也必须保留 HTTP/SDK/CLI contract 测试。
