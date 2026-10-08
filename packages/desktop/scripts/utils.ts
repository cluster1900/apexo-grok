import { $ } from "bun"
import { chmod, copyFile } from "node:fs/promises"
import { join } from "node:path"

export type Channel = "dev" | "beta" | "prod"

export function resolveChannel(): Channel {
  const raw = Bun.env.APEXO_CHANNEL
  if (raw === "dev" || raw === "beta" || raw === "prod") return raw
  return "dev"
}

// The experimental v2 sidecar (APEXO_SIDECAR_V2=1) runs the workspace CLI from packages/cli.
// Build it from source for this machine and stage it as resources/apexo-cli; the default
// v1 sidecar does not need it, so the step is skipped unless v2 is requested.
export async function stageCliToResources() {
  if (Bun.env.APEXO_SIDECAR_V2 !== "1") {
    console.log("Skipping v2 CLI staging (set APEXO_SIDECAR_V2=1 to build it)")
    return
  }
  const cliDir = join(import.meta.dir, "..", "..", "cli")
  await $`bun run --cwd ${cliDir} build --single`
  const os = process.platform === "win32" ? "windows" : process.platform
  const source = windowsify(join(cliDir, "dist", `cli-${os}-${process.arch}`, "bin", "lildax"))
  const dest = windowsify("resources/apexo-cli")
  await copyFile(source, dest)
  if (process.platform !== "win32") await chmod(dest, 0o755)
  if (process.platform === "darwin") await $`codesign --force --sign - ${dest}`
  console.log(`Staged ${source} to ${dest}`)
}

export function windowsify(path: string) {
  if (path.endsWith(".exe")) return path
  return `${path}${process.platform === "win32" ? ".exe" : ""}`
}
