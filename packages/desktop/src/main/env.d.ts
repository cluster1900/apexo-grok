interface ImportMetaEnv {
  readonly APEXO_CHANNEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:apexo-server" {
  export namespace Server {
    export const listen: typeof import("../../../apexo/dist/types/src/node").Server.listen
    export type Listener = import("../../../apexo/dist/types/src/node").Server.Listener
  }
  export namespace Config {
    export const get: typeof import("../../../apexo/dist/types/src/node").Config.get
    export type Info = import("../../../apexo/dist/types/src/node").Config.Info
  }
  export const bootstrap: typeof import("../../../apexo/dist/types/src/node").bootstrap
}
