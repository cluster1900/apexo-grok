import { describe, expect, test } from "bun:test"
import fs from "fs/promises"
import os from "os"
import path from "path"
import { Global } from "@apexo/core/global"
import { LEGACY_APP_DIR_NAME } from "@apexo/core/legacy-compat"

describe("global paths", () => {
  test("tmp path is under the system temp directory", () => {
    expect(Global.Path.tmp).toBe(path.join(os.tmpdir(), "apexo"))
    expect(Global.make().tmp).toBe(Global.Path.tmp)
  })

  test("tmp path is created on module load", async () => {
    expect((await fs.stat(Global.Path.tmp)).isDirectory()).toBe(true)
  })
})

describe("apexo app directories", () => {
  test("prefers apexo, falls back to an existing legacy directory", async () => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), "apexo-dirs-"))
    try {
      expect(Global.resolveAppDir(base, "")).toBe(path.join(base, "apexo"))
      await fs.mkdir(path.join(base, LEGACY_APP_DIR_NAME))
      expect(Global.resolveAppDir(base, "")).toBe(path.join(base, LEGACY_APP_DIR_NAME))
      await fs.mkdir(path.join(base, "apexo"))
      expect(Global.resolveAppDir(base, "")).toBe(path.join(base, "apexo"))
      expect(Global.resolveAppDir(base, "custom")).toBe(path.join(base, "custom"))
    } finally {
      await fs.rm(base, { recursive: true, force: true })
    }
  })
})
