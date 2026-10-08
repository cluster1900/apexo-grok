import { LayerNode } from "@apexo/core/effect/layer-node"
import { serviceUse } from "@apexo/core/effect/service-use"
import { Effect, Layer, Context } from "effect"
import type { SessionID } from "@/session/schema"

// Session sharing to the hosted share service has been removed from this build.
// The service shape is kept so callers (HTTP API, `import`, GitHub handler) keep compiling;
// every network operation fails with a clear error and nothing is ever uploaded.
export const DISABLED_MESSAGE = "Session sharing has been removed from this build"

export type Api = {
  create: string
  sync: (shareID: string) => string
  remove: (shareID: string) => string
  data: (shareID: string) => string
}

export type Req = {
  headers: Record<string, string>
  api: Api
  baseUrl: string
}

export type Share = {
  readonly id: string
  readonly url: string
  readonly secret: string
}

export interface Interface {
  readonly init: () => Effect.Effect<void, unknown>
  readonly url: () => Effect.Effect<string, unknown>
  readonly request: () => Effect.Effect<Req, unknown>
  readonly create: (sessionID: SessionID) => Effect.Effect<Share, unknown>
  readonly remove: (sessionID: SessionID) => Effect.Effect<void, unknown>
}

export class Service extends Context.Service<Service, Interface>()("@apexo/ShareNext") {}

export const use = serviceUse(Service)

const disabled = () => Effect.fail(new Error(DISABLED_MESSAGE))

const layer = Layer.succeed(
  Service,
  Service.of({
    init: () => Effect.void,
    url: disabled,
    request: disabled,
    create: disabled,
    remove: () => Effect.void,
  }),
)

export const node = LayerNode.make({
  service: Service,
  layer: layer,
  deps: [],
})

export * as ShareNext from "./share-next"
