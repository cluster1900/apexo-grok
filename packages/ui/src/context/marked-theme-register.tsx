import { registerCustomTheme } from "@pierre/diffs"
import { ApexoTheme } from "./marked-theme"

let registered = false

export function registerApexoTheme() {
  if (registered) return
  registered = true
  registerCustomTheme("Apexo", () => Promise.resolve(ApexoTheme))
}
