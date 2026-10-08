import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dir = path.resolve(__dirname, "..")

process.chdir(dir)

const modelsUrl = process.env.APEXO_MODELS_URL || "https://models.dev"
const catalog = process.env.MODELS_DEV_API_JSON
  ? await Bun.file(process.env.MODELS_DEV_API_JSON).text()
  : await fetch(`${modelsUrl}/api.json`).then((response) => response.text())

// Only embed the built-in providers (keep in sync with ALLOWED_PROVIDERS in
// packages/core/src/models-dev.ts); the rest of the catalog would be filtered out at runtime anyway.
const ALLOWED_PROVIDERS = ["xai", "openai", "anthropic", "google"]
export const modelsData = JSON.stringify(
  Object.fromEntries(
    Object.entries(JSON.parse(catalog) as Record<string, unknown>).filter(([id]) => ALLOWED_PROVIDERS.includes(id)),
  ),
)
console.log("Loaded models.dev snapshot")
