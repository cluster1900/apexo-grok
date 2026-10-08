import path from "path"

// Keep the legacy "apexo" directory layout that test fixtures expect.
process.env["APEXO_APP_DIR_NAME"] = "apexo"

process.env.APEXO_DB = ":memory:"
process.env.NPM_CONFIG_AUDIT = "false"
process.env.APEXO_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.APEXO_DISABLE_MODELS_FETCH = "true"
