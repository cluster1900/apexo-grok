import { describe, expect, test } from "bun:test"
import { shouldQueueFollowup } from "./followup-delivery"

const base = {
  busy: true,
  pending: false,
  mode: "normal" as const,
  newSession: false,
}

describe("followup delivery", () => {
  test("stages follow-ups while busy or while an earlier message is waiting", () => {
    expect(shouldQueueFollowup(base)).toBe(true)
    expect(shouldQueueFollowup({ ...base, busy: false, pending: true })).toBe(true)
  })

  test("sends immediately when idle, in shell, or starting a session", () => {
    expect(shouldQueueFollowup({ ...base, busy: false })).toBe(false)
    expect(shouldQueueFollowup({ ...base, mode: "shell" })).toBe(false)
    expect(shouldQueueFollowup({ ...base, newSession: true })).toBe(false)
  })
})
