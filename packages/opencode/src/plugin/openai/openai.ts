import type { Hooks, PluginInput } from "@opencode-ai/plugin"
import { InstallationVersion } from "@opencode-ai/core/installation/version"
import os from "os"
import { OpenAIWebSocketPool } from "./ws-pool"

export interface OpenAIPluginOptions {
  experimentalWebSockets?: boolean
}

// OpenAI is API-key only in this build; the ChatGPT Plus/Pro (Codex) OAuth flow has been removed.
export async function OpenAIPlugin(_input: PluginInput, options: OpenAIPluginOptions = {}): Promise<Hooks> {
  let websocketFetchInstalled = false
  const websocketFetches: Array<ReturnType<typeof OpenAIWebSocketPool.createWebSocketFetch>> = []

  return {
    async dispose() {
      for (const websocketFetch of websocketFetches) websocketFetch.close()
      websocketFetches.length = 0
    },
    async event(input) {
      if (input.event.type !== "session.deleted") return
      for (const websocketFetch of websocketFetches) websocketFetch.remove(input.event.properties.info.id)
    },
    auth: {
      provider: "openai",
      async loader() {
        if (!options.experimentalWebSockets) return {}
        const websocketFetch = OpenAIWebSocketPool.createWebSocketFetch({ httpFetch: fetch })
        websocketFetches.push(websocketFetch)
        websocketFetchInstalled = true
        return { fetch: websocketFetch }
      },
      methods: [
        {
          label: "API key",
          type: "api",
        },
      ],
    },
    "chat.headers": async (input, output) => {
      if (input.model.providerID !== "openai") return
      output.headers.originator = "opencode"
      output.headers["User-Agent"] = `opencode/${InstallationVersion} (${os.platform()} ${os.release()}; ${os.arch()})`
      output.headers["session-id"] = input.sessionID
      // Title generation shares the conversation session ID, so mark it for HTTP fallback.
      if (websocketFetchInstalled && input.agent === "title") output.headers[OpenAIWebSocketPool.TITLE_HEADER] = "true"
    },
    "chat.params": async (input, output) => {
      if (input.model.providerID !== "openai") return
      output.maxOutputTokens = undefined
    },
  }
}
