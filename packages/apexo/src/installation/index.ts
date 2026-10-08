import { LayerNode } from "@apexo/core/effect/layer-node"
import { AppNodeBuilder } from "@apexo/core/effect/app-node-builder"
import { Effect, Layer, Context } from "effect"
import { serviceUse } from "@apexo/core/effect/service-use"
import path from "path"
import { makeRuntime } from "@apexo/core/effect/runtime"
import { InstallationChannel, InstallationVersion } from "@apexo/core/installation/version"

export type Method = "curl" | "unknown"

export function userAgent(client = "cli") {
  return `apexo/${InstallationChannel}/${InstallationVersion}/${client}`
}

export const USER_AGENT = userAgent()

export function isPreview() {
  return InstallationChannel !== "latest"
}

export function isLocal() {
  return InstallationChannel === "local"
}

// Upstream update checks and self-upgrade were removed; only install-method detection remains (used by `uninstall`).
export interface Interface {
  readonly method: () => Effect.Effect<Method>
}

export class Service extends Context.Service<Service, Interface>()("@apexo/Installation") {}

export const use = serviceUse(Service)

// Apexo ships only via GitHub release binaries (install script) or a source build.
const layer: Layer.Layer<Service> = Layer.succeed(
  Service,
  Service.of({
    method: () =>
      Effect.sync((): Method => {
        if (process.execPath.includes(path.join(".apexo", "bin"))) return "curl"
        if (process.execPath.includes(path.join(".local", "bin"))) return "curl"
        return "unknown"
      }),
  }),
)

export const node = LayerNode.make({ service: Service, layer: layer, deps: [] })

const { runPromise } = makeRuntime(Service, AppNodeBuilder.build(node))

export const method = () => runPromise((s) => s.method())

export * as Installation from "."
