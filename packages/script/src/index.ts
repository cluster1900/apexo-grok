import { $ } from "bun"
import semver from "semver"
import path from "path"

const rootPkgPath = path.resolve(import.meta.dir, "../../../package.json")
const rootPkg = await Bun.file(rootPkgPath).json()
const expectedBunVersion = rootPkg.packageManager?.split("@")[1]

if (!expectedBunVersion) {
  throw new Error("packageManager field not found in root package.json")
}

// relax version requirement
const expectedBunVersionRange = `^${expectedBunVersion}`

if (!semver.satisfies(process.versions.bun, expectedBunVersionRange)) {
  throw new Error(`This script requires bun@${expectedBunVersionRange}, but you are using bun@${process.versions.bun}`)
}

const env = {
  APEXO_CHANNEL: process.env["APEXO_CHANNEL"],
  APEXO_BUMP: process.env["APEXO_BUMP"],
  APEXO_VERSION: process.env["APEXO_VERSION"],
  APEXO_RELEASE: process.env["APEXO_RELEASE"],
}
const CHANNEL = await (async () => {
  if (env.APEXO_CHANNEL) return env.APEXO_CHANNEL
  if (env.APEXO_BUMP) return "latest"
  if (env.APEXO_VERSION && !env.APEXO_VERSION.startsWith("0.0.0-")) return "latest"
  return await $`git branch --show-current`.text().then((x) => x.trim())
})()
const IS_PREVIEW = CHANNEL !== "latest"

const VERSION = await (async () => {
  if (env.APEXO_VERSION) return env.APEXO_VERSION
  if (IS_PREVIEW) return `0.0.0-${CHANNEL}-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")}`
  // Latest released version comes from the newest `v*` git tag (releases are GitHub Releases only).
  const tag = await $`git tag --list "v*" --sort=-v:refname`
    .nothrow()
    .quiet()
    .text()
    .then((x) => x.split("\n").find((line) => /^v\d+\.\d+\.\d+$/.test(line.trim())))
  const version = tag?.trim().slice(1) ?? "0.0.0"
  const [major, minor, patch] = version.split(".").map((x: string) => Number(x) || 0)
  const t = env.APEXO_BUMP?.toLowerCase()
  if (t === "major") return `${major + 1}.0.0`
  if (t === "minor") return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
})()

export const Script = {
  get channel() {
    return CHANNEL
  },
  get version() {
    return VERSION
  },
  get preview() {
    return IS_PREVIEW
  },
  get release(): boolean {
    return !!env.APEXO_RELEASE
  },
}
console.log(`apexo script`, JSON.stringify(Script, null, 2))
