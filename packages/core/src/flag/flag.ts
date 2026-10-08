import "./apexo-env"
import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["APEXO_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["APEXO_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("APEXO_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  APEXO_AUTO_HEAP_SNAPSHOT: truthy("APEXO_AUTO_HEAP_SNAPSHOT"),
  APEXO_GIT_BASH_PATH: process.env["APEXO_GIT_BASH_PATH"],
  APEXO_CONFIG: process.env["APEXO_CONFIG"],
  APEXO_CONFIG_CONTENT: process.env["APEXO_CONFIG_CONTENT"],
  APEXO_DISABLE_AUTOUPDATE: truthy("APEXO_DISABLE_AUTOUPDATE"),
  APEXO_ALWAYS_NOTIFY_UPDATE: truthy("APEXO_ALWAYS_NOTIFY_UPDATE"),
  APEXO_DISABLE_PRUNE: truthy("APEXO_DISABLE_PRUNE"),
  APEXO_DISABLE_TERMINAL_TITLE: truthy("APEXO_DISABLE_TERMINAL_TITLE"),
  APEXO_SHOW_TTFD: truthy("APEXO_SHOW_TTFD"),
  APEXO_DISABLE_AUTOCOMPACT: truthy("APEXO_DISABLE_AUTOCOMPACT"),
  APEXO_DISABLE_MODELS_FETCH: truthy("APEXO_DISABLE_MODELS_FETCH"),
  APEXO_DISABLE_MOUSE: truthy("APEXO_DISABLE_MOUSE"),
  APEXO_FAKE_VCS: process.env["APEXO_FAKE_VCS"],
  APEXO_SERVER_PASSWORD: process.env["APEXO_SERVER_PASSWORD"],
  APEXO_SERVER_USERNAME: process.env["APEXO_SERVER_USERNAME"],
  APEXO_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("APEXO_DISABLE_FFF"),

  // Experimental
  APEXO_EXPERIMENTAL_FILEWATCHER: Config.boolean("APEXO_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  APEXO_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("APEXO_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  APEXO_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("APEXO_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  APEXO_MODELS_URL: process.env["APEXO_MODELS_URL"],
  APEXO_MODELS_PATH: process.env["APEXO_MODELS_PATH"],
  APEXO_DB: process.env["APEXO_DB"],

  APEXO_WORKSPACE_ID: process.env["APEXO_WORKSPACE_ID"],
  APEXO_EXPERIMENTAL_WORKSPACES: enabledByExperimental("APEXO_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get APEXO_DISABLE_PROJECT_CONFIG() {
    return truthy("APEXO_DISABLE_PROJECT_CONFIG")
  },
  get APEXO_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("APEXO_EXPERIMENTAL_REFERENCES")
  },
  get APEXO_TUI_CONFIG() {
    return process.env["APEXO_TUI_CONFIG"]
  },
  get APEXO_CONFIG_DIR() {
    return process.env["APEXO_CONFIG_DIR"]
  },
  get APEXO_PURE() {
    return truthy("APEXO_PURE")
  },
  get APEXO_PERMISSION() {
    return process.env["APEXO_PERMISSION"]
  },
  get APEXO_PLUGIN_META_FILE() {
    return process.env["APEXO_PLUGIN_META_FILE"]
  },
  get APEXO_CLIENT() {
    return process.env["APEXO_CLIENT"] ?? "cli"
  },
}
