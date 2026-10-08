# Apexo CLI and server (`packages/apexo`)

This package builds the `apexo` command: the terminal UI, the local HTTP server used by the
web and desktop apps, `apexo run`, `apexo acp` and the other subcommands. The directory and the
npm package keep their upstream `apexo` names to make upstream merges easier.

```bash
bun install
bun run src/index.ts --help          # run from source (same as `bun dev` at the repo root)
bun run build --single               # build dist/apexo-<os>-<arch>/bin/apexo
bun test                             # tests (run from this directory, not the repo root)
```

See the [root README](../../README.md) for providers (xAI Grok first; OpenAI, Anthropic and Google
via API key), configuration (`apexo.json`, `.apexo/`, `APEXO_*` with Apexo fallbacks) and themes.
