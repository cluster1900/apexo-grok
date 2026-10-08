import { define } from "@apexo/plugin/v2/effect/plugin"
import { Effect } from "effect"
import type { Scope } from "effect"
import { ModelV2 } from "../../model"
import { ProviderV2 } from "../../provider"
import type { PluginInternal } from "../internal"

// OpenAI is API-key only in this build; the ChatGPT Plus/Pro (Codex) OAuth methods have been removed.
export const OpenAIPlugin = define({
  id: "openai",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.catalog.transform(
      Effect.fn(function* (evt) {
        for (const item of evt.provider.list()) {
          if (item.provider.api.type !== "aisdk") continue
          if (item.provider.api.package !== "@ai-sdk/openai") continue
          if (!item.models.has(ModelV2.ID.make("gpt-5-chat-latest"))) continue
          evt.model.update(item.provider.id, ModelV2.ID.make("gpt-5-chat-latest"), (model) => {
            // OpenAIPlugin sends OpenAI models through Responses; this alias is a
            // chat-completions-only model, so hide it only from OpenAI's catalog.
            model.enabled = false
          })
        }
      }),
    )
    yield* ctx.aisdk.sdk(
      Effect.fn(function* (evt) {
        if (evt.package !== "@ai-sdk/openai") return
        const mod = yield* Effect.promise(() => import("@ai-sdk/openai"))
        evt.sdk = mod.createOpenAI(evt.options)
      }),
    )
    yield* ctx.aisdk.language(
      Effect.fn(function* (evt) {
        if (evt.model.providerID !== ProviderV2.ID.openai) return
        evt.language = evt.sdk.responses(evt.model.api.id)
      }),
    )
  }),
} satisfies PluginInternal.Plugin<PluginInternal.Requirements | Scope.Scope>)
