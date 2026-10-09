import { describe, expect, test } from "bun:test"
import { createRoot } from "solid-js"
import { createStore } from "solid-js/store"
import type { PromptDraft } from "../../src/prompt/delivery"
import { createPromptQueue } from "../../src/prompt/queue"

function draft(inputText: string, sessionID = "first"): PromptDraft {
  return {
    sessionID,
    inputText,
    agentName: "build",
    model: { providerID: "test", modelID: "test" },
    mode: "normal",
    nonTextParts: [],
    editorParts: [],
    historyPrompt: { input: inputText, parts: [], mode: "normal" },
  }
}

function setup() {
  return createRoot((dispose) => {
    const [state, setState] = createStore({ busy: {} as Record<string, boolean> })
    const requests: Array<{ draft: PromptDraft } & ReturnType<typeof Promise.withResolvers<void>>> = []
    const errors: unknown[] = []
    const queue = createPromptQueue({
      busy: (id) => state.busy[id] ?? true,
      deliver: (draft) => {
        const request = { draft, ...Promise.withResolvers<void>() }
        requests.push(request)
        return request.promise
      },
      onError: (error) => errors.push(error),
    })
    return { queue, requests, errors, setBusy: (id: string, busy: boolean) => setState("busy", id, busy), dispose }
  })
}

describe("prompt queue", () => {
  test("waits until idle and sends FIFO without overlapping requests", async () => {
    const h = setup()
    try {
      h.queue.push(draft("one"))
      h.queue.push(draft("two"))
      expect(h.requests).toHaveLength(0)
      h.setBusy("first", false)
      expect(h.requests.map((item) => item.draft.inputText)).toEqual(["one"])
      h.setBusy("first", true)
      h.setBusy("first", false)
      expect(h.requests).toHaveLength(1)
      h.requests[0].resolve()
      await h.requests[0].promise
      expect(h.requests.map((item) => item.draft.inputText)).toEqual(["one", "two"])
      expect(h.queue.pop("first")).toBeUndefined()
      h.requests[1].resolve()
      await h.requests[1].promise
      expect(h.queue.list("first")).toEqual([])
    } finally {
      h.dispose()
    }
  })

  test("keeps independent session queues alive when another session is viewed", async () => {
    const h = setup()
    try {
      h.queue.push(draft("one"))
      h.queue.push(draft("two", "second"))
      expect(h.queue.list("second").map((item) => item.inputText)).toEqual(["two"])
      h.setBusy("first", false)
      h.setBusy("second", false)
      expect(h.requests.map((item) => item.draft.sessionID)).toEqual(["first", "second"])
      h.requests.forEach((item) => item.resolve())
      await Promise.all(h.requests.map((item) => item.promise))
      expect(h.queue.list("first")).toEqual([])
      expect(h.queue.list("second")).toEqual([])
    } finally {
      h.dispose()
    }
  })

  test("retains failed drafts and pauses later messages for recovery", async () => {
    const h = setup()
    try {
      h.queue.push(draft("one"))
      h.queue.push(draft("two"))
      h.setBusy("first", false)
      h.requests[0].reject(new Error("offline"))
      await h.requests[0].promise.catch(() => undefined)
      h.setBusy("first", true)
      h.setBusy("first", false)
      expect(h.requests).toHaveLength(1)
      expect(h.errors).toHaveLength(1)
      expect(h.queue.list("first").map((item) => item.inputText)).toEqual(["one", "two"])
      expect(h.queue.pop("first")?.inputText).toBe("two")
      expect(h.queue.pop("first")?.inputText).toBe("one")
      h.queue.push(draft("retry"))
      expect(h.requests).toHaveLength(2)
      h.requests[1].resolve()
      await h.requests[1].promise
    } finally {
      h.dispose()
    }
  })

  test("interrupt pauses automatic delivery and queued snapshots preserve attachments", () => {
    const h = setup()
    try {
      const value = draft("one")
      value.historyPrompt.parts.push({ type: "file", mime: "text/plain", url: "file:///first.txt" })
      h.queue.push(value)
      value.historyPrompt.parts.splice(0)
      h.queue.pause("first")
      h.setBusy("first", false)
      expect(h.requests).toHaveLength(0)
      expect(h.queue.pop("first")?.historyPrompt.parts).toHaveLength(1)
    } finally {
      h.dispose()
    }
  })

  test("allows editing a waiting draft while an earlier request is in flight", async () => {
    const h = setup()
    try {
      h.queue.push(draft("one"))
      h.queue.push(draft("two"))
      h.setBusy("first", false)
      expect(h.queue.pop("first")?.inputText).toBe("two")
      expect(h.queue.pop("first")).toBeUndefined()
      h.requests[0].resolve()
      await h.requests[0].promise
      expect(h.requests).toHaveLength(1)
      expect(h.queue.list("first")).toEqual([])
    } finally {
      h.dispose()
    }
  })
})
