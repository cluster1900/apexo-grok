import { expect, test } from "bun:test"
import { createRoot } from "solid-js"
import { createStore } from "solid-js/store"
import { createPromptInputV2Controller } from "@apexo/session-ui/v2/prompt-input/interaction"
import type { PromptInputV2PersistedState } from "@apexo/session-ui/v2/prompt-input/types"

test("V2 forwards queue keystrokes and only recalls drafts into an empty editor outside IME composition", () => {
  createRoot((dispose) => {
    try {
      const store = createStore<PromptInputV2PersistedState>({ prompt: [], cursor: 0, context: { items: [] } })
      const submitted: Array<Event | undefined> = []
      let edited = 0
      const controller = createPromptInputV2Controller({
        store,
        commands: () => [],
        context: () => [],
        searchContextFiles: () => [],
        view: {
          submit: { stopping: () => false, onSubmit: (event) => submitted.push(event), onStop: () => undefined },
          onEditLatest: () => {
            edited++
          },
        },
      })
      const queue = new KeyboardEvent("keydown", { key: "Enter", altKey: true })
      expect(controller.onKeyDown(queue)).toBeFalsy()
      controller.submit(queue)
      expect(submitted).toEqual([queue])

      const edit = () => new KeyboardEvent("keydown", { key: "ArrowUp", altKey: true, cancelable: true })
      controller.onKeyDown(new KeyboardEvent("keydown", { key: "ArrowUp", altKey: true, isComposing: true }))
      expect(edited).toBe(0)
      expect(controller.onKeyDown(edit())).toBe(true)
      expect(edited).toBe(1)
      store[1]("prompt", [{ type: "text", content: "draft", start: 0, end: 5 }])
      expect(controller.onKeyDown(edit())).toBeFalsy()
      store[1]("prompt", [])
      store[1]("context", "items", [{ type: "file", path: "notes.txt", key: "notes" }])
      expect(controller.onKeyDown(edit())).toBeFalsy()
      expect(edited).toBe(1)
    } finally {
      dispose()
    }
  })
})
