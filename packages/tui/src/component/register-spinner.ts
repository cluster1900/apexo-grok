import { getComponentCatalogue } from "@opentui/solid/components"
import { registerSpinner } from "opentui-spinner/solid"

export function registerApexoSpinner() {
  if (!getComponentCatalogue().spinner) registerSpinner()
}
