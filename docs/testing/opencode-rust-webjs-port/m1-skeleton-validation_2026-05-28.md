# M1 skeleton 验证报告 — 2026-05-28

## 1. 验证范围

本报告验证 M1 已落位的 Rust skeleton/seam：

- Rust workspace 与 crate 边界。
- domain/application/provider/server/desktop 五个 crate 的最小可编译 contract。
- HTTP health/OpenAPI router。
- TypeScript SDK codegen seam。
- Desktop WebJS sidecar JSON contract。
- mock provider application 垂直链路。

## 2. 运行时覆盖

| 范围 | Rust 落位 | 验证 |
|---|---|---|
| domain 值对象 | `opencode_domain::{ProviderId, ModelId, SessionId}` | 空值、非法字符、model slash、session id 校验。 |
| domain serde 边界 | `ProviderId` serde try-from contract | serde round-trip、非法 route key 反序列化拒绝。 |
| provider application seam | `opencode_application::{ChatProviderPort, ProviderRegistry}` | 注册 provider 成功响应、替换 provider、未注册 provider `ProviderNotFound`。 |
| provider infrastructure seam | `opencode_provider::{HttpProviderTransport, HttpChatProvider}` | transport 构造和 unsupported placeholder doctest。 |
| HTTP/OpenAPI seam | `opencode_server::{router, openapi_document, serve}` | `/global/health`、`/openapi.json` handler 测试。 |
| TCP server runner | `opencode_server::serve(listener, CancellationToken)` | ephemeral listener + `reqwest` health 请求 + graceful shutdown。 |
| SDK codegen seam | `opencode_server::generate_typescript_sdk` | 生成 `client.ts` / `index.ts`、缺失 operation fail-fast、空生成字段 fail-fast。 |
| Desktop sidecar contract | `opencode_desktop::{InitStep, ServerReadyData, MigrationProgress, SidecarEvent}` | ready JSON、password Debug 脱敏、progress 范围、init step 标签、空 password/error 和非法 progress 反序列化拒绝。 |

## 3. 本地命令

```text
cargo fmt --all -- --check
cargo test --workspace --all-features
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo deny check
cargo audit
git diff --check
```

## 4. 当前结果

| 检查 | 结果 |
|---|---|
| 单元测试 | 23 个通过。 |
| Doctest | 84 个通过。 |
| Clippy | 通过，`-D warnings`。 |
| deny | advisories/bans/licenses/sources 均通过。 |
| audit | 当前锁文件依赖未命中 RustSec 漏洞。 |

## 5. 非目标

本报告不证明真实 agent loop、session persistence、tool execution、provider protocol streaming、MCP/plugin、PTY/LSP、Electron utility process、完整 CLI 33 command modules 或 HTTP/OpenAPI 131 operations 已完成。

## 6. 结论

M1 已从纯文档阶段进入可测试 Rust skeleton 阶段，并完成 server/OpenAPI/SDK/Desktop/provider seam 的闭环验证。下一步可把 CLI/Desktop 启动入口、Basic Auth/workspace routing、contract inventory diff 和 provider recorded/golden fixture 接入同一 workspace。
