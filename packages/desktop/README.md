# Apexo Desktop

The Apexo desktop app, built with Electron. It bundles the `apexo` server as a sidecar and
shows the same UI as `apexo web`, with the Grove theme by default.

## Development

```bash
bun install
bun dev
```

## Build

Run the `build` script to build the app's JS assets, then `package` to bundle them as an
application. The resulting app will be in `dist/`.

```bash
bun run build && bun run package
```

Notes:

- There is no auto-updater; rebuild or install a newer release to update.
- The app ID (`com.apexolab.desktop*`) is unchanged so existing user data and OS integrations
  keep working.
- Linux `.deb` packaging needs a maintainer email (`author.email` in `package.json`), which is
  not set.

Report desktop issues at https://github.com/cluster1900/apexo-grok/issues.
