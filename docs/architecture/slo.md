# SLO

| 指标 | 目标 | 适用阶段 |
|---|---:|---|
| CLI/TUI 启动到可输入 p95 | <= 1500ms | M2 |
| Desktop sidecar 启动到 `/global/health` ready p95 | <= 5000ms | M2 |
| HTTP 非 streaming 端点 p95 | <= 200ms（不含外部 I/O） | M2 |
| Provider 首 token p95 | 上游 provider p95 + 300ms | M3 |
| Tool permission prompt 展示 p95 | <= 300ms | M2 |
| PTY WebSocket 建连 p95 | <= 500ms | M3 |
| SQLite event replay 1000 条 p95 | <= 1000ms | M3 |
| Ctrl+C/SIGTERM 退出 | <= 1s 且无孤儿子进程 | M2 |

高风险变更（agent loop、tool permission、provider streaming、prompt 主路径、workspace sandbox）必须 feature flag 默认 off，并有回滚说明。
