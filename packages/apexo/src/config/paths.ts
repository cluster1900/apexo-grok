export * as ConfigPaths from "./paths"

import path from "path"
import { Flag } from "@apexo/core/flag/flag"
import { Global } from "@apexo/core/global"
import { LEGACY_CONFIG_DIR, LEGACY_CONFIG_NAME } from "@apexo/core/legacy-compat"
import { unique } from "remeda"
import * as Effect from "effect/Effect"
import { FSUtil } from "@apexo/core/fs-util"

// Main config file base names, highest precedence first: apexo.json(c), then the legacy name
// from legacy-compat.ts. Apexo wins when both exist in a directory.
export const CONFIG_NAMES = ["apexo", LEGACY_CONFIG_NAME] as const
// Project config directories, highest precedence first: .apexo, then the legacy directory.
export const CONFIG_DIRS = [".apexo", LEGACY_CONFIG_DIR] as const

// Config file names in merge order (lowest precedence first): legacy names, then apexo.json(c).
export const CONFIG_FILES = [
  `${LEGACY_CONFIG_NAME}.json`,
  `${LEGACY_CONFIG_NAME}.jsonc`,
  "apexo.json",
  "apexo.jsonc",
] as const

export function isConfigDir(dir: string) {
  return CONFIG_DIRS.some((name) => dir.endsWith(name))
}

export const files = Effect.fn("ConfigPaths.projectFiles")(function* (
  name: string | readonly string[],
  directory: string,
  worktree?: string,
) {
  const afs = yield* FSUtil.Service
  const names = typeof name === "string" ? [name] : name
  return (yield* afs.up({
    targets: names.flatMap((item) => [`${item}.jsonc`, `${item}.json`]),
    start: directory,
    stop: worktree,
  })).toReversed()
})

export const directories = Effect.fn("ConfigPaths.directories")(function* (directory: string, worktree?: string) {
  const afs = yield* FSUtil.Service
  return unique([
    Global.Path.config,
    ...(!Flag.APEXO_DISABLE_PROJECT_CONFIG
      ? yield* afs.up({
          targets: [...CONFIG_DIRS],
          start: directory,
          stop: worktree,
        })
      : []),
    ...(yield* afs.up({
      targets: [...CONFIG_DIRS],
      start: Global.Path.home,
      stop: Global.Path.home,
    })),
    ...(Flag.APEXO_CONFIG_DIR ? [Flag.APEXO_CONFIG_DIR] : []),
  ])
})

export function fileInDirectory(dir: string, name: string) {
  return [path.join(dir, `${name}.json`), path.join(dir, `${name}.jsonc`)]
}
