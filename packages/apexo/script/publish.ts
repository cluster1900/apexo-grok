#!/usr/bin/env bun
// Apexo publishes release binaries as GitHub release assets on cluster1900/apexo-grok
// (uploaded by .github/workflows/publish.yml) plus a container image on GHCR.
// The inherited npm, AUR and Homebrew publishing targeted upstream-owned registries and was removed.
import { $ } from "bun"
import { Script } from "@apexo/script"
import { fileURLToPath } from "url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

const image = "ghcr.io/cluster1900/apexo-grok"
const platforms = "linux/amd64,linux/arm64"
const tags = [`${image}:${Script.version}`, `${image}:${Script.channel}`]
const tagFlags = tags.flatMap((t) => ["-t", t])

if (!Script.preview) {
  await $`chmod -R 755 ./dist`
  await $`docker buildx build --platform ${platforms} ${tagFlags} --push .`
}
