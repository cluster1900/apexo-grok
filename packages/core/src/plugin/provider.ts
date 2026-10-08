import { AnthropicPlugin } from "./provider/anthropic"
import { DynamicProviderPlugin } from "./provider/dynamic"
import { GooglePlugin } from "./provider/google"
import { OpenAIPlugin } from "./provider/openai"
import { OpenAICompatiblePlugin } from "./provider/openai-compatible"
import { XAIPlugin } from "./provider/xai"
import type { PluginInternal } from "./internal"
import type { Scope } from "effect"

// Built-in providers are limited to xAI, OpenAI, Anthropic and Google. OpenAICompatiblePlugin and
// DynamicProviderPlugin stay so custom providers declared in apexo.json keep working.
export const ProviderPlugins: PluginInternal.Plugin<PluginInternal.Requirements | Scope.Scope>[] = [
  AnthropicPlugin,
  GooglePlugin,
  OpenAICompatiblePlugin,
  OpenAIPlugin,
  XAIPlugin,
  DynamicProviderPlugin,
]
