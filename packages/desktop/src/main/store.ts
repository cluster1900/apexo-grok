import Store from "electron-store"
import electron from "electron"
import { copyFileSync, existsSync, rmSync } from "node:fs"
import { LEGACY_STORAGE_PREFIX } from "@apexo/core/legacy-compat"
import { join } from "node:path"

import { SETTINGS_STORE } from "./store-keys"
import { deleteStoreFileIfEmpty } from "./store-cleanup"

const cache = new Map<string, Store>()

// We cannot instantiate the electron-store at module load time because
// module import hoisting causes this to run before app.setPath("userData", ...)
// in index.ts has executed, which would result in files being written to the default directory
// (e.g. bad: %APPDATA%\@apexo\desktop\apexo.settings vs good: %APPDATA%\com.apexolab.desktop.dev\apexo.settings).
export function getStore(name = SETTINGS_STORE) {
  const cached = cache.get(name)
  if (cached) return cached
  adoptLegacyStoreFile(name)
  const next = new Store({
    name,
    cwd: electron.app.getPath("userData"),
    fileExtension: "",
    accessPropertiesByDotNotation: false,
  })
  cache.set(name, next)
  return next
}

// Copy a store file saved under the legacy storage prefix (legacy-compat.ts) to its Apexo name once.
function adoptLegacyStoreFile(name: string) {
  if (!name.startsWith("apexo.")) return
  const dir = electron.app.getPath("userData")
  const target = join(dir, name)
  const legacy = join(dir, LEGACY_STORAGE_PREFIX + name.slice("apexo.".length))
  if (!existsSync(target) && existsSync(legacy)) copyFileSync(legacy, target)
}

export async function removeStoreFileIfEmpty(name: string) {
  if (await deleteStoreFileIfEmpty(electron.app.getPath("userData"), name)) cache.delete(name)
}

export function removeStoreFile(name: string) {
  rmSync(join(electron.app.getPath("userData"), name), { force: true })
  cache.delete(name)
}
