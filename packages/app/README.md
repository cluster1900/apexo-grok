# Apexo app (`packages/app`)

The SolidJS web UI used by `apexo web` and the Apexo desktop app. The default theme is Grove.

## Development

```bash
bun install
bun run dev          # Vite dev server on http://localhost:3000
bun run build        # production build into dist/
bun run test:unit    # unit tests
```

The UI talks to a local Apexo server (`apexo serve`).

## E2E Testing

Playwright starts the Vite dev server automatically via `webServer`, and UI tests expect an Apexo backend (`apexo serve --port 4096`) at `localhost:4096` by default.

```bash
bunx playwright install chromium
bun run test:e2e:local
bun run test:e2e:local -- --grep "settings"
```

Environment options:

- `PLAYWRIGHT_SERVER_HOST` / `PLAYWRIGHT_SERVER_PORT` (backend address, default: `localhost:4096`)
- `PLAYWRIGHT_PORT` (Vite dev server port, default: `3000`)
- `PLAYWRIGHT_BASE_URL` (override base URL, default: `http://localhost:<PLAYWRIGHT_PORT>`)

