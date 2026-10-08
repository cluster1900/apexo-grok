export * from "./client.js"
export * from "./server.js"

import { createApexoClient } from "./client.js"
import { createApexoServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export * as data from "./data.js"

export async function createApexo(options?: ServerOptions) {
  const server = await createApexoServer({
    ...options,
  })

  const client = createApexoClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
