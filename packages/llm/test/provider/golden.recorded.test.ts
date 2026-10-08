import * as Anthropic from "../../src/providers/anthropic"
import * as Google from "../../src/providers/google"
import * as OpenAI from "../../src/providers/openai"
import * as XAI from "../../src/providers/xai"
import { describeRecordedGoldenScenarios } from "../recorded-golden"

const openAI = OpenAI.configure({
  apiKey: process.env.OPENAI_API_KEY ?? "fixture",
})
const openAIChat = openAI.chat("gpt-4o-mini")
const openAIResponses = openAI.responses("gpt-5.5")
const openAIResponsesWebSocket = openAI.responsesWebSocket("gpt-4.1-mini")
const anthropic = Anthropic.configure({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "fixture",
})
const anthropicHaiku = anthropic.model("claude-haiku-4-5-20251001")
const anthropicOpus = anthropic.model("claude-opus-4-7")
const google = Google.configure({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "fixture" })
const gemini = google.model("gemini-2.5-flash")
const xai = XAI.configure({ apiKey: process.env.XAI_API_KEY ?? "fixture" })
const xaiBasic = xai.model("grok-3-mini")
const xaiFlagship = xai.model("grok-4.3")

describeRecordedGoldenScenarios([
  {
    name: "OpenAI Chat gpt-4o-mini",
    prefix: "openai-chat",
    model: openAIChat,
    requires: ["OPENAI_API_KEY"],
    scenarios: ["text", "tool-call", "tool-loop", { id: "image-tool-result", maxTokens: 40 }],
  },
  {
    name: "OpenAI Responses gpt-5.5",
    prefix: "openai-responses",
    model: openAIResponses,
    requires: ["OPENAI_API_KEY"],
    tags: ["flagship"],
    scenarios: [
      { id: "text", temperature: false },
      { id: "reasoning", temperature: false },
      { id: "reasoning-continuation", temperature: false },
      { id: "tool-call", temperature: false },
      { id: "tool-loop", temperature: false },
      { id: "image-tool-result", temperature: false, maxTokens: 40 },
    ],
  },
  {
    name: "OpenAI Responses WebSocket gpt-4.1-mini",
    prefix: "openai-responses-websocket",
    model: openAIResponsesWebSocket,
    transport: "websocket",
    requires: ["OPENAI_API_KEY"],
    scenarios: ["tool-loop"],
  },
  {
    name: "Anthropic Haiku 4.5",
    prefix: "anthropic-messages",
    model: anthropicHaiku,
    requires: ["ANTHROPIC_API_KEY"],
    options: { redact: { allowRequestHeaders: ["anthropic-version"] } },
    scenarios: ["text", "tool-call"],
  },
  {
    name: "Anthropic Opus 4.7",
    prefix: "anthropic-messages",
    model: anthropicOpus,
    requires: ["ANTHROPIC_API_KEY"],
    tags: ["flagship"],
    options: { redact: { allowRequestHeaders: ["anthropic-version"] } },
    scenarios: [
      { id: "tool-loop", temperature: false },
      { id: "image-tool-result", temperature: false, maxTokens: 40 },
    ],
  },
  {
    name: "Gemini 2.5 Flash",
    prefix: "gemini",
    model: gemini,
    requires: ["GOOGLE_GENERATIVE_AI_API_KEY"],
    scenarios: [
      { id: "text", maxTokens: 80 },
      "tool-call",
      { id: "image", maxTokens: 160 },
      { id: "image-tool-result", maxTokens: 40 },
    ],
  },
  {
    name: "xAI Grok 3 Mini",
    prefix: "xai",
    model: xaiBasic,
    requires: ["XAI_API_KEY"],
    scenarios: ["text", "tool-call"],
  },
  {
    name: "xAI Grok 4.3",
    prefix: "xai",
    model: xaiFlagship,
    requires: ["XAI_API_KEY"],
    tags: ["flagship"],
    scenarios: [{ id: "tool-loop", timeout: 30_000 }],
  },
])
