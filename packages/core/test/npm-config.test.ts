import path from "path"
import { describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { NpmConfig } from "@apexo/core/npm-config"
import { tmpdir } from "./fixture/tmpdir"

// npm resolves the project .npmrc from the nearest ancestor with a package.json or node_modules,
// so give each temp project its own package.json instead of depending on what sits above /tmp.
async function project() {
  const tmp = await tmpdir()
  await Bun.write(path.join(tmp.path, "package.json"), "{}\n")
  return tmp
}

describe("NpmConfig.load", () => {
  test("reads registry from project .npmrc", async () => {
    await using tmp = await project()
    await Bun.write(path.join(tmp.path, ".npmrc"), "registry=https://registry.example.test/\n")

    const config = await Effect.runPromise(NpmConfig.load(tmp.path))

    expect(config.registry).toBe("https://registry.example.test/")
  })

  test("reads scoped registries from project .npmrc", async () => {
    await using tmp = await project()
    await Bun.write(path.join(tmp.path, ".npmrc"), "@acme:registry=https://npm.acme.test/\n")

    const config = await Effect.runPromise(NpmConfig.load(tmp.path))

    expect(config["@acme:registry"]).toBe("https://npm.acme.test/")
  })

  test("flattens boolean and list options", async () => {
    await using tmp = await project()
    await Bun.write(path.join(tmp.path, ".npmrc"), "ignore-scripts=true\nomit[]=dev\nomit[]=optional\n")

    const config = await Effect.runPromise(NpmConfig.load(tmp.path))

    expect(config.ignoreScripts).toBe(true)
    expect(config.omit).toEqual(["dev", "optional"])
  })
})

describe("NpmConfig.registry", () => {
  test("normalizes configured registry without trailing slash", async () => {
    await using tmp = await project()
    await Bun.write(path.join(tmp.path, ".npmrc"), "registry=https://registry.example.test/\n")

    await expect(Effect.runPromise(NpmConfig.registry(tmp.path))).resolves.toBe("https://registry.example.test")
  })

  test("leaves configured registry without trailing slash unchanged", async () => {
    await using tmp = await project()
    await Bun.write(path.join(tmp.path, ".npmrc"), "registry=https://registry.example.test\n")

    await expect(Effect.runPromise(NpmConfig.registry(tmp.path))).resolves.toBe("https://registry.example.test")
  })
})
