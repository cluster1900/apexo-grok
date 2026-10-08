import path from "path"
import fs from "fs/promises"
import { existsSync } from "fs"
import { xdgData, xdgCache, xdgConfig, xdgState } from "xdg-basedir"
import os from "os"
import { Context, Effect, Layer } from "effect"
import { Flock } from "./util/flock"
import { Flag } from "./flag/flag"
import { makeGlobalNode } from "./effect/app-node"
import { LEGACY_APP_DIR_NAME } from "./legacy-compat"

// Apexo stores its files under "apexo" directories. If an "apexo" directory does not exist yet
// but a legacy one does (see legacy-compat.ts), the legacy directory is used so sessions, auth
// and config are not lost. APEXO_APP_DIR_NAME forces a specific directory name.
export const APP_DIR_NAME = "apexo"
export { LEGACY_APP_DIR_NAME }

export function resolveAppDir(base: string, forced = process.env.APEXO_APP_DIR_NAME) {
  if (forced) return path.join(base, forced)
  const next = path.join(base, APP_DIR_NAME)
  if (existsSync(next)) return next
  const legacy = path.join(base, LEGACY_APP_DIR_NAME)
  if (existsSync(legacy)) return legacy
  return next
}

const data = resolveAppDir(xdgData!)
const cache = resolveAppDir(xdgCache!)
const config = resolveAppDir(xdgConfig!)
const state = resolveAppDir(xdgState!)
const tmp = path.join(os.tmpdir(), process.env.APEXO_APP_DIR_NAME || APP_DIR_NAME)

const paths = {
  get home() {
    return process.env.APEXO_TEST_HOME ?? os.homedir()
  },
  data,
  bin: path.join(cache, "bin"),
  log: path.join(data, "log"),
  repos: path.join(data, "repos"),
  cache,
  config,
  state,
  tmp,
}

export const Path = paths

Flock.setGlobal({ state })

await Promise.all([
  fs.mkdir(Path.data, { recursive: true }),
  fs.mkdir(Path.config, { recursive: true }),
  fs.mkdir(Path.state, { recursive: true }),
  fs.mkdir(Path.tmp, { recursive: true }),
  fs.mkdir(Path.log, { recursive: true }),
  fs.mkdir(Path.bin, { recursive: true }),
  fs.mkdir(Path.repos, { recursive: true }),
])

export class Service extends Context.Service<Service, Interface>()("@apexo/Global") {}

export interface Interface {
  readonly home: string
  readonly data: string
  readonly cache: string
  readonly config: string
  readonly state: string
  readonly tmp: string
  readonly bin: string
  readonly log: string
  readonly repos: string
}

export function make(input: Partial<Interface> = {}): Interface {
  return {
    home: Path.home,
    data: Path.data,
    cache: Path.cache,
    config: Flag.APEXO_CONFIG_DIR ?? Path.config,
    state: Path.state,
    tmp: Path.tmp,
    bin: Path.bin,
    log: Path.log,
    repos: Path.repos,
    ...input,
  }
}

const layer = Layer.effect(
  Service,
  Effect.sync(() => Service.of(make())),
)

export const node = makeGlobalNode({ service: Service, layer: layer, deps: [] })

export const layerWith = (input: Partial<Interface>) =>
  Layer.effect(
    Service,
    Effect.sync(() => Service.of(make(input))),
  )

export * as Global from "./global"
