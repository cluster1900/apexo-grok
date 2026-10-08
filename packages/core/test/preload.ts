import path from "path"

// Keep the legacy "opencode" directory layout that test fixtures expect.
process.env["OPENCODE_APP_DIR_NAME"] = "opencode"

process.env.OPENCODE_DB = ":memory:"
process.env.NPM_CONFIG_AUDIT = "false"
process.env.OPENCODE_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.OPENCODE_DISABLE_MODELS_FETCH = "true"
