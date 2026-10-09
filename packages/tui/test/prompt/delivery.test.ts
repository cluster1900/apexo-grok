import { describe, expect, test } from "bun:test"
import { createApexoClient } from "@apexo/sdk/v2"
import { deliverPrompt, shouldQueuePrompt, type PromptDraft } from "../../src/prompt/delivery"

describe("shouldQueuePrompt", () => {
  test("queues a normal prompt while the session is busy or a prompt is already waiting", () => {
    expect(shouldQueuePrompt({ delivery: "queue", busy: true, pending: false, mode: "normal" })).toBe(true)
    expect(shouldQueuePrompt({ delivery: "queue", busy: false, pending: true, mode: "normal" })).toBe(true)
  })

  test("sends immediately when nothing is waiting, the prompt steers, or the mode is shell", () => {
    expect(shouldQueuePrompt({ delivery: "queue", busy: false, pending: false, mode: "normal" })).toBe(false)
    expect(shouldQueuePrompt({ delivery: "steer", busy: true, pending: true, mode: "normal" })).toBe(false)
    expect(shouldQueuePrompt({ delivery: "queue", busy: true, pending: false, mode: "shell" })).toBe(false)
  })
})

describe("deliverPrompt", () => {
  test("sends prompt and command snapshots through the SDK and surfaces HTTP failures", async () => {
    const requests: Array<{ path: string; body: unknown }> = []
    const client = createApexoClient({
      baseUrl: "http://localhost",
      fetch: async (request: Request) => {
        requests.push({ path: new URL(request.url).pathname, body: await request.json() })
        if (requests.length === 3) return Response.json({ message: "offline" }, { status: 503 })
        return Response.json({})
      },
    })
    const draft: PromptDraft = {
      sessionID: "session-1",
      agentName: "build",
      model: { providerID: "test", modelID: "test-model" },
      variant: "thinking",
      mode: "normal",
      inputText: "hello",
      editorParts: [],
      nonTextParts: [{ type: "file", mime: "text/plain", url: "file:///notes.txt" }],
      historyPrompt: { input: "hello", parts: [] },
    }
    await deliverPrompt(client.session, [], draft)
    await deliverPrompt(client.session, [{ name: "review" }], { ...draft, inputText: "/review first\nsecond" })
    expect(requests).toEqual([
      {
        path: "/session/session-1/message",
        body: {
          agent: "build",
          model: draft.model,
          variant: "thinking",
          parts: [{ type: "text", text: "hello" }, ...draft.nonTextParts],
        },
      },
      {
        path: "/session/session-1/command",
        body: {
          command: "review",
          arguments: "first\nsecond",
          agent: "build",
          model: "test/test-model",
          variant: "thinking",
          parts: draft.nonTextParts,
        },
      },
    ])
    await expect(
      deliverPrompt(client.session, [{ name: "review" }], { ...draft, inputText: "/review" }),
    ).rejects.toMatchObject({ message: "offline" })
  })
})
