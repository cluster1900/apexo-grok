import { describe, expect, test } from "bun:test"
import { applyLegacyEnv, LEGACY_ENV_PREFIX } from "@apexo/core/legacy-compat"

describe("legacy env fallback", () => {
  test("copies legacy variables to APEXO_* without overriding APEXO_*", () => {
    const legacy = LEGACY_ENV_PREFIX
    const env: Record<string, string | undefined> = {
      APEXO_CONFIG: "/a/apexo.json",
      [legacy + "CONFIG"]: "/a/legacy.json",
      [legacy + "SERVER_PASSWORD"]: "legacy",
    }
    applyLegacyEnv(env)
    expect(env.APEXO_CONFIG).toBe("/a/apexo.json")
    expect(env.APEXO_SERVER_PASSWORD).toBe("legacy")
  })
})
