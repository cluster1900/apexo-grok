import { expect, test } from "@playwright/test"
import { mockApexoServer } from "../utils/mock-server"
import { expectAppVisible } from "../utils/waits"

const directory = "C:/Apexo/NewProject"

test("creates a session in a new project, connects xAI, and selects its model", async ({ page }) => {
  let connectedXai = false
  let pendingXai = false
  const connections: Array<{ integrationID: string; body: unknown }> = []

  await mockApexoServer(page, {
    directory,
    project: {
      id: "proj_model_selection_flow",
      worktree: directory,
      vcs: "git",
      name: "NewProject",
      time: { created: 1_700_000_000_000, updated: 1_700_000_000_000 },
      sandboxes: [],
    },
    provider: () => ({
      all: [
        {
          id: "ollama",
          name: "Ollama (local)",
          models: {
            "free-model": {
              id: "free-model",
              name: "Free Model",
              cost: { input: 0, output: 0 },
              limit: { context: 200_000 },
            },
          },
        },
        {
          id: "xai",
          name: "xAI",
          models: {
            "grok-model-1": {
              id: "grok-model-1",
              name: "Grok Model 1",
              cost: { input: 1, output: 1 },
              limit: { context: 200_000 },
            },
          },
        },
      ],
      connected: connectedXai ? ["ollama", "xai"] : ["ollama"],
      default: { providerID: "ollama", modelID: "free-model" },
    }),
    integrationMethods: { xai: [{ type: "api", label: "API key" }] },
    onConnectKey: (input) => {
      connections.push(input)
      if (input.integrationID === "xai") pendingXai = true
    },
    onInstanceDispose: () => {
      if (pendingXai) connectedXai = true
    },
    sessions: [],
    pageMessages: () => ({ items: [] }),
    fileList: (path) =>
      path ? [] : [{ name: "NewProject", path: "NewProject", absolute: directory, type: "directory", ignored: false }],
    findFiles: () => ["NewProject"],
  })
  await page.addInitScript(() => {
    localStorage.setItem("settings.v3", JSON.stringify({ general: { newLayoutDesigns: true } }))
    localStorage.setItem("apexo.global.dat:server", JSON.stringify({ projects: { local: [] } }))
  })

  await page.goto("/")
  const addProject = page.locator('[data-action="home-add-project-row"]')
  await expectAppVisible(addProject)
  await addProject.click()
  await page.locator("[data-directory-path]").click()

  await page.locator('[data-action="home-new-session"]').click()
  await expectAppVisible(page.locator('[data-component="prompt-input-v2"]'))

  const modelControl = page.locator('[data-action="prompt-model"]')
  await modelControl.click()
  await expect(page.locator('[data-section="free-models"]')).toContainText("Free models")

  await page.locator('[data-provider-id="xai"]').click()
  await page.locator('[data-input="provider-api-key"]').fill("mock-xai-api-key")
  await page.locator('[data-action="provider-connect-submit"]').click()
  await expect(page.locator('[data-component="dialog-v2"]')).toHaveCount(0)
  expect(connections).toEqual([{ integrationID: "xai", body: { type: "api", key: "mock-xai-api-key" } }])

  await expect(modelControl).toHaveAttribute("data-control-type", "popover")
  await modelControl.click()
  const grokModel = page.locator('[data-option-key="xai:grok-model-1"]')
  await expect(grokModel).toBeVisible()
  await grokModel.click()

  await expect(modelControl).toContainText("Grok Model 1")
})
