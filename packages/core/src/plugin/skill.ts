/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeApexoContent from "./skill/customize-apexo.md" with { type: "text" }

export const CustomizeApexoContent = customizeApexoContent

export const Plugin = define({
  id: "skill",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.skill.transform((draft) => {
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "customize-apexo",
            description:
              "Use ONLY when the user is editing or creating apexo's own configuration: apexo.json, apexo.jsonc, files under .apexo/, or files under ~/.config/apexo/. Also use when creating or fixing apexo agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring apexo itself.",
            location: AbsolutePath.make("/builtin/customize-apexo.md"),
            content: CustomizeApexoContent,
          }),
        }),
      )
    })
  }),
})
