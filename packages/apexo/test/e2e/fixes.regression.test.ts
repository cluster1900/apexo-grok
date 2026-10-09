import { describe, expect } from "bun:test"
import { Deferred, Effect, Fiber } from "effect"
import path from "path"
import { LayerNode } from "@apexo/core/effect/layer-node"
import { CrossSpawnSpawner } from "@apexo/core/cross-spawn-spawner"
import { FSUtil } from "@apexo/core/fs-util"
import { Agent } from "@/agent/agent"
import { Config } from "@/config/config"
import { Plugin } from "@/plugin"
import { Truncate } from "@/tool/truncate"
import { Tool } from "@/tool/tool"
import { ShellTool } from "@/tool/shell"
import { SessionStatus } from "@/session/status"
import { Snapshot } from "@/snapshot"
import { EventV2Bridge } from "@/event-v2-bridge"
import { RuntimeFlags } from "@/effect/runtime-flags"
import { MessageID, SessionID } from "@/session/schema"
import { TestInstance } from "../fixture/fixture"
import { awaitWithTimeout, testEffect } from "../lib/effect"

const it = testEffect(
  LayerNode.compile(
    LayerNode.group([
      Agent.node,
      Config.node,
      FSUtil.node,
      Plugin.node,
      Truncate.node,
      SessionStatus.node,
      Snapshot.node,
      RuntimeFlags.node,
      EventV2Bridge.node,
      CrossSpawnSpawner.node,
    ]),
  ),
)

describe("V1 regression coverage", () => {
  it.instance("publishes one idle transition and exposes the new state to event listeners", () =>
    Effect.gen(function* () {
      const status = yield* SessionStatus.Service
      const events = yield* EventV2Bridge.Service
      const sessionID = SessionID.descending()
      const seen: string[] = []
      const states: SessionStatus.Info[] = []
      const off = yield* events.listen((event) =>
        Effect.gen(function* () {
          if (event.type !== SessionStatus.Event.Status.type && event.type !== SessionStatus.Event.Idle.type) return
          seen.push(event.type)
          states.push(yield* status.get(sessionID))
        }),
      )
      yield* Effect.addFinalizer(() => off)
      yield* status.set(sessionID, { type: "idle" })
      expect(seen).toEqual([])
      yield* status.set(sessionID, { type: "busy" })
      yield* status.set(sessionID, { type: "idle" })
      yield* status.set(sessionID, { type: "idle" })
      expect(seen).toEqual(["session.status", "session.status", "session.idle"])
      expect(states).toEqual([{ type: "busy" }, { type: "idle" }, { type: "idle" }])
      expect((yield* status.list()).has(sessionID)).toBe(false)
    }),
  )

  it.instance("coalesces concurrent idle transitions while an event listener is suspended", () =>
    Effect.gen(function* () {
      const status = yield* SessionStatus.Service
      const events = yield* EventV2Bridge.Service
      const sessionID = SessionID.descending()
      const entered = yield* Deferred.make<void>()
      const release = yield* Deferred.make<void>()
      const seen: string[] = []
      yield* status.set(sessionID, { type: "busy" })
      const off = yield* events.listen((event) =>
        Effect.gen(function* () {
          if (event.type !== SessionStatus.Event.Status.type && event.type !== SessionStatus.Event.Idle.type) return
          seen.push(event.type)
          if (event.type !== SessionStatus.Event.Status.type) return
          yield* Deferred.succeed(entered, undefined)
          yield* Deferred.await(release)
        }),
      )
      yield* Effect.addFinalizer(() => off)
      const first = yield* status.set(sessionID, { type: "idle" }).pipe(Effect.forkChild)
      yield* awaitWithTimeout(Deferred.await(entered), "idle event was not published")
      const second = yield* status.set(sessionID, { type: "idle" }).pipe(Effect.forkChild)
      yield* Effect.yieldNow
      yield* Deferred.succeed(release, undefined)
      yield* Fiber.join(first)
      yield* Fiber.join(second)
      expect(seen).toEqual(["session.status", "session.idle"])
    }),
  )
  ;[
    { name: "non-git workspace", options: { git: false } },
    { name: "disabled snapshots", options: { git: true, config: { snapshot: false } } },
  ].forEach((scenario) => {
    it.instance(
      `keeps files intact and returns empty snapshot results in ${scenario.name}`,
      () =>
        Effect.gen(function* () {
          const snapshot = yield* Snapshot.Service
          const fs = yield* FSUtil.Service
          const instance = yield* TestInstance
          const file = path.join(instance.directory, "important.txt")
          yield* fs.writeWithDirs(file, "important data")
          expect(yield* snapshot.track()).toBeUndefined()
          expect(yield* snapshot.patch("missing")).toEqual({ hash: "missing", files: [] })
          expect(yield* snapshot.diff("missing")).toBe("")
          expect(yield* snapshot.diffFull("missing", "also-missing")).toEqual([])
          yield* snapshot.restore("missing")
          yield* snapshot.revert([{ hash: "missing", files: [file] }])
          expect(yield* fs.readFileString(file)).toBe("important data")
        }),
      scenario.options,
    )
  })
  ;[1, 2].forEach((count) => {
    it.instance(
      `preserves ${count} file(s) when the snapshot hash is invalid`,
      () =>
        Effect.gen(function* () {
          const snapshot = yield* Snapshot.Service
          const fs = yield* FSUtil.Service
          const instance = yield* TestInstance
          const files = Array.from({ length: count }, (_, index) => path.join(instance.directory, `${index}.txt`))
          yield* Effect.forEach(files, (file) => fs.writeWithDirs(file, "important data"))
          expect(yield* snapshot.track()).toBeDefined()
          yield* snapshot.revert([{ hash: "invalid-snapshot-hash", files }])
          expect(yield* Effect.forEach(files, (file) => fs.readFileString(file))).toEqual(
            files.map(() => "important data"),
          )
        }),
      { git: true },
    )
  })
  ;[
    "export REVIEW_VAR=123",
    "# comment\nexport REVIEW_VAR=123",
    "> blocked.txt",
    "# comment\n> blocked.txt",
    "cd . > blocked.txt",
    "cd .; export REVIEW_VAR=123 > blocked.txt",
  ].forEach((command) => {
    it.instance(`requests permission before executing ${JSON.stringify(command)}`, () =>
      Effect.gen(function* () {
        const shell = yield* ShellTool
        const tool = yield* shell.init()
        const instance = yield* TestInstance
        const fs = yield* FSUtil.Service
        const requests: Parameters<Tool.Context["ask"]>[0][] = []
        const exit = yield* tool
          .execute(
            { command },
            {
              sessionID: SessionID.descending(),
              messageID: MessageID.ascending(),
              agent: "build",
              abort: new AbortController().signal,
              callID: "permission-regression",
              messages: [],
              metadata: () => Effect.void,
              ask: (request) => {
                requests.push(request)
                return Effect.die(new Error("permission denied"))
              },
            },
          )
          .pipe(Effect.exit)
        expect(requests).toHaveLength(1)
        expect(requests[0]).toMatchObject({ permission: "bash", metadata: { command } })
        expect(requests[0].patterns).toContain(command.trim())
        expect(exit._tag).toBe("Failure")
        expect(yield* fs.existsSafe(path.join(instance.directory, "blocked.txt"))).toBe(false)
      }),
    )
  })
})
