#!/usr/bin/env bun
// Regenerates the JSON schemas in /schemas. Config and theme files point their "$schema" at
// https://raw.githubusercontent.com/cluster1900/apexo-grok/main/schemas/<name>.json.
import { $ } from "bun"
import path from "path"

const root = path.resolve(import.meta.dir, "..")
const out = path.join(root, "schemas")
const BASE = "https://raw.githubusercontent.com/cluster1900/apexo-grok/main/schemas"

async function withId(file: string, id: string) {
  const schema = await Bun.file(file).json()
  const { $schema, ...rest } = schema
  await Bun.write(file, JSON.stringify({ $schema, $id: id, ...rest }, null, 2) + "\n")
}

// apexo.json(c) and tui.json, generated from the config schemas.
await $`bun ./script/schema.ts ${path.join(out, "config.json")} ${path.join(out, "tui.json")}`.cwd(
  path.join(root, "packages/apexo"),
)
await withId(path.join(out, "config.json"), `${BASE}/config.json`)
await withId(path.join(out, "tui.json"), `${BASE}/tui.json`)

// Desktop/web UI themes: the schema maintained next to the UI theme loader.
await withId(path.join(root, "packages/ui/src/theme/desktop-theme.schema.json"), `${BASE}/desktop-theme.json`)
await $`cp ${path.join(root, "packages/ui/src/theme/desktop-theme.schema.json")} ${path.join(out, "desktop-theme.json")}`

// TUI themes: color keys come from the bundled "classic" theme (packages/tui/src/theme/index.ts ThemeJson).
const classic = await Bun.file(path.join(root, "packages/tui/src/theme/assets/classic.json")).json()
const optional = new Set(["selectedListItemText", "backgroundMenu", "thinkingOpacity"])
const colorKeys = [
  ...new Set([...Object.keys(classic.theme), "selectedListItemText", "backgroundMenu"]),
].filter((key) => key !== "thinkingOpacity")
const colorValue = {
  oneOf: [
    { $ref: "#/$defs/colorRef" },
    {
      type: "object",
      properties: { dark: { $ref: "#/$defs/colorRef" }, light: { $ref: "#/$defs/colorRef" } },
      required: ["dark", "light"],
      additionalProperties: false,
    },
  ],
}
const theme = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${BASE}/theme.json`,
  title: "Apexo TUI theme",
  type: "object",
  properties: {
    $schema: { type: "string" },
    defs: {
      type: "object",
      description: "Named colors that theme entries can reference by name",
      additionalProperties: { $ref: "#/$defs/colorRef" },
    },
    theme: {
      type: "object",
      properties: {
        ...Object.fromEntries(colorKeys.map((key) => [key, colorValue])),
        thinkingOpacity: { type: "number", minimum: 0, maximum: 1 },
      },
      required: colorKeys.filter((key) => !optional.has(key)),
      additionalProperties: false,
    },
  },
  required: ["theme"],
  additionalProperties: false,
  $defs: {
    colorRef: {
      type: "string",
      description: 'A hex color ("#rrggbb"), "none", or the name of a color in "defs"',
    },
  },
}
await Bun.write(path.join(out, "theme.json"), JSON.stringify(theme, null, 2) + "\n")

await $`bun run prettier --write ${out} ${path.join(root, "packages/ui/src/theme/desktop-theme.schema.json")}`.cwd(root)
// The TUI config schema inlines every keybind definition; keep it compact (schemas/tui.json is in .prettierignore).
const tui = path.join(out, "tui.json")
await Bun.write(tui, JSON.stringify(await Bun.file(tui).json()) + "\n")
console.log("schemas written to", out)
