import { describe, expect, test } from "bun:test"
import { applyApexoEnvAliases } from "@opencode-ai/core/flag/apexo-env"

describe("APEXO_* env aliases", () => {
  test("mirrors APEXO_* into OPENCODE_* and lets APEXO_* win", () => {
    const env: Record<string, string | undefined> = {
      APEXO_CONFIG: "/a/apexo.json",
      OPENCODE_CONFIG: "/a/opencode.json",
      APEXO_DISABLE_AUTOUPDATE: "1",
      OPENCODE_SERVER_PASSWORD: "legacy",
    }
    applyApexoEnvAliases(env)
    expect(env.OPENCODE_CONFIG).toBe("/a/apexo.json")
    expect(env.OPENCODE_DISABLE_AUTOUPDATE).toBe("1")
    expect(env.OPENCODE_SERVER_PASSWORD).toBe("legacy")
  })
})
