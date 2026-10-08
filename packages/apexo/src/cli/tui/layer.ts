import { run as runTui, type TuiInput } from "@apexo/tui"
import { Global } from "@apexo/core/global"
import { AppNodeBuilder } from "@apexo/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
