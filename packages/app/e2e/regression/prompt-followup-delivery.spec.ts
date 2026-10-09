import { expect, test, type Page, type Route } from "@playwright/test"
import { base64Encode } from "@apexo/core/util/encode"
import { mockApexoServer } from "../utils/mock-server"
import { installSseTransport } from "../utils/sse-transport"
import { expectSessionTitle } from "../utils/waits"

const directory = "C:/Apexo/FollowupDelivery"
const sessionID = "ses_followup_delivery"
const title = "Follow-up delivery"
const userMessageID = "msg_0001_original_user"
const assistantMessageID = "msg_0002_original_reply"
const originalPrompt = "Read the project and explain its structure"
const originalReply = {
  id: "prt_original_reply",
  sessionID,
  messageID: assistantMessageID,
  type: "text",
  text: "Reading the project files",
}

for (const action of ["steer", "queue"] as const) {
  test(`stages a busy follow-up before choosing ${action}`, async ({ page }, testInfo) => {
    const { transport, requests, composer, editor, dock } = await setup(page)
    await editor.fill(`Follow-up ${action}`)
    await expect(composer.getByRole("button", { name: "Send", exact: true })).toBeEnabled()
    if (action === "steer") await editor.press("Enter")
    if (action === "queue") await composer.getByRole("button", { name: "Send", exact: true }).click()

    await expect(dock.getByText(`Follow-up ${action}`, { exact: true })).toBeVisible()
    await expect(editor).toHaveText("")
    await expect(dock.getByRole("button", { name: "Send now", exact: true })).toBeEnabled()
    await expect(dock.getByRole("button", { name: "Queue", exact: true })).toBeEnabled()
    expect(requests).toEqual([])
    await page.screenshot({ path: testInfo.outputPath("followup-choice.png") })

    if (action === "steer") {
      const sent = page.waitForRequest(
        (request) => request.method() === "POST" && request.url().endsWith(`/session/${sessionID}/prompt_async`),
      )
      await dock.getByRole("button", { name: "Send now", exact: true }).click()
      await sent
    }
    if (action === "queue") {
      await dock.getByRole("button", { name: "Queue", exact: true }).click()
      await expect(dock.getByRole("button", { name: "Queue", exact: true })).toHaveAttribute("aria-pressed", "true")
      expect(requests).toEqual([])
      const sent = page.waitForRequest(
        (request) => request.method() === "POST" && request.url().endsWith(`/session/${sessionID}/prompt_async`),
      )
      await transport.send({
        directory,
        payload: { type: "session.status", properties: { sessionID, status: { type: "idle" } } },
      })
      await sent
    }
    await expect(dock).toHaveCount(0)
    expect(requests).toHaveLength(1)
    expect(requests[0]).toMatchObject({
      agent: "build",
      model: { providerID: "test", modelID: "test-model" },
      parts: [expect.objectContaining({ type: "text", text: `Follow-up ${action}` })],
    })
  })
}

test("keeps an unconfirmed follow-up staged when the current task finishes", async ({ page }) => {
  const { transport, requests, composer, editor, dock } = await setup(page)
  await editor.fill("Decide after completion")
  await editor.press("Enter")
  await expect(dock.getByText("Decide after completion", { exact: true })).toBeVisible()
  await transport.send({
    directory,
    payload: { type: "session.status", properties: { sessionID, status: { type: "idle" } } },
  })
  await expect(composer.getByRole("button", { name: "Send", exact: true })).toBeDisabled()
  await expect(dock.getByRole("button", { name: "Queue", exact: true })).toBeEnabled()
  expect(requests).toEqual([])
})

test("repeated Queue clicks keep the choice selected without moving the button or sending", async ({
  page,
}, testInfo) => {
  const { requests, composer, editor, dock } = await setup(page)
  await editor.fill("Keep waiting")
  await editor.press("Enter")
  const queue = dock.getByRole("button", { name: "Queue", exact: true })
  await expect(queue).toBeEnabled()
  const position = await queue.boundingBox()
  expect(position).not.toBeNull()
  await queue.click()
  await expect(queue).toHaveAttribute("aria-pressed", "true")
  for (let click = 0; click < 5; click++) {
    await page.mouse.click(position!.x + position!.width / 2, position!.y + position!.height / 2)
    await expect(queue).toHaveAttribute("aria-pressed", "true")
  }
  await expect(composer.getByRole("button", { name: "Stop", exact: true })).toBeVisible()
  await expect(dock.getByText("Keep waiting", { exact: true })).toBeVisible()
  expect(requests).toEqual([])
  await page.screenshot({ path: testInfo.outputPath("queue-selected.png") })
})

for (const action of ["steer", "queue"] as const) {
  test(`editing history preserves the running task before choosing ${action}`, async ({ page }) => {
    const { transport, requests, changes, composer, editor, dock } = await setup(page)
    const message = page.locator('[data-component="user-message"]').filter({ hasText: originalPrompt })
    await expect(message).toBeVisible()
    await message.hover()
    await message.getByRole("button", { name: "Edit", exact: true }).click()
    await expect(editor).toHaveText(originalPrompt)
    await expect(message).toBeVisible()
    expect(changes).toEqual([])

    await editor.press("Enter")
    await expect(editor).toHaveText("")
    await expect(composer.getByRole("button", { name: "Stop", exact: true })).toBeVisible()
    await expect(dock.getByText(originalPrompt, { exact: true })).toBeVisible()
    expect(requests).toEqual([])

    await transport.send({
      directory,
      payload: {
        type: "message.part.updated",
        properties: { part: { ...originalReply, text: "Still reading the project after editing history" } },
      },
    })
    await expect(page.getByText("Still reading the project after editing history", { exact: true })).toBeVisible()

    if (action === "queue") {
      await dock.getByRole("button", { name: "Queue", exact: true }).click()
      await expect(dock.getByRole("button", { name: "Queue", exact: true })).toHaveAttribute("aria-pressed", "true")
      expect(requests).toEqual([])
      await transport.send({
        directory,
        payload: { type: "session.status", properties: { sessionID, status: { type: "idle" } } },
      })
    }
    if (action === "steer") await dock.getByRole("button", { name: "Send now", exact: true }).click()
    await expect(dock).toHaveCount(0)
    expect(requests).toHaveLength(1)
    expect(changes).toEqual([])
  })
}

test("dispatches confirmed messages one at a time and keeps undecided messages staged", async ({ page }) => {
  const { transport, requests, composer, editor, dock } = await setup(page)
  for (const text of ["First queued", "Second queued", "Still deciding"]) {
    await editor.fill(text)
    await editor.press("Enter")
    const item = dock.getByRole("listitem").filter({ hasText: text })
    await expect(item).toBeVisible()
    if (text === "Still deciding") continue
    await item.getByRole("button", { name: "Queue", exact: true }).click()
    await expect(item.getByRole("button", { name: "Queue", exact: true })).toHaveAttribute("aria-pressed", "true")
  }
  expect(requests).toEqual([])
  for (const text of ["First queued", "Second queued"]) {
    await transport.send({
      directory,
      payload: { type: "session.status", properties: { sessionID, status: { type: "idle" } } },
    })
    await expect(dock.getByText(text, { exact: true })).toHaveCount(0)
    await expect(composer.getByRole("button", { name: "Stop", exact: true })).toBeVisible()
    expect(requests).toHaveLength(text === "First queued" ? 1 : 2)
  }
  await transport.send({
    directory,
    payload: { type: "session.status", properties: { sessionID, status: { type: "idle" } } },
  })
  await expect(composer.getByRole("button", { name: "Send", exact: true })).toBeDisabled()
  await expect(dock.getByText("Still deciding", { exact: true })).toBeVisible()
  expect(requests).toHaveLength(2)
})

test("stopping a task keeps its queue paused even after staging another message", async ({ page }) => {
  const { requests, changes, composer, editor, dock } = await setup(page)
  await editor.fill("Wait through stop")
  await editor.press("Enter")
  await dock.getByRole("button", { name: "Queue", exact: true }).click()
  await composer.getByRole("button", { name: "Stop", exact: true }).click()
  await expect(composer.getByRole("button", { name: "Send", exact: true })).toBeDisabled()
  expect(changes).toEqual(["abort"])
  expect(requests).toEqual([])
  await editor.fill("Wait too")
  await editor.press("Enter")
  const item = dock.getByRole("listitem").filter({ hasText: "Wait too" })
  await item.getByRole("button", { name: "Queue", exact: true }).click()
  await expect(item.getByRole("button", { name: "Queue", exact: true })).toHaveAttribute("aria-pressed", "true")
  await expect(dock.getByRole("listitem")).toHaveCount(2)
  expect(requests).toEqual([])
})

for (const outcome of ["failure", "stop"] as const) {
  test(`keeps the remaining queue paused after a manual send ${outcome}`, async ({ page }) => {
    const { requests, composer, editor, dock } = await setup(page)
    for (const text of ["Keep paused", "Send manually"]) {
      await editor.fill(text)
      await editor.press("Enter")
      const item = dock.getByRole("listitem").filter({ hasText: text })
      await item.getByRole("button", { name: "Queue", exact: true }).click()
      await expect(item.getByRole("button", { name: "Queue", exact: true })).toHaveAttribute("aria-pressed", "true")
    }
    await composer.getByRole("button", { name: "Stop", exact: true }).click()
    await expect(composer.getByRole("button", { name: "Send", exact: true })).toBeDisabled()
    const pending = Promise.withResolvers<Route>()
    await page.route(`**/session/${sessionID}/prompt_async`, (route) => {
      requests.push(route.request().postDataJSON())
      pending.resolve(route)
    })
    const manual = dock.getByRole("listitem").filter({ hasText: "Send manually" })
    await manual.getByRole("button", { name: "Send now", exact: true }).click()
    const request = await pending.promise
    await expect(manual.getByRole("button", { name: "Send now", exact: true })).toBeDisabled()
    if (outcome === "stop") {
      await composer.getByRole("button", { name: "Stop", exact: true }).click()
      await expect(composer.getByRole("button", { name: "Send", exact: true })).toBeDisabled()
    }
    await request.fulfill({
      status: outcome === "failure" ? 503 : 204,
      headers: { "access-control-allow-origin": "*" },
    })
    if (outcome === "failure") await expect(manual.getByRole("button", { name: "Send now", exact: true })).toBeEnabled()
    if (outcome === "stop") await expect(manual).toHaveCount(0)
    await expect(dock.getByText("Keep paused", { exact: true })).toBeVisible()
    await expect(composer.getByRole("button", { name: "Send", exact: true })).toBeDisabled()
    expect(requests).toHaveLength(1)
  })
}

async function setup(page: Page) {
  const transport = await installSseTransport(page, {
    server: `http://${process.env.PLAYWRIGHT_SERVER_HOST ?? "127.0.0.1"}:${process.env.PLAYWRIGHT_SERVER_PORT ?? "4096"}`,
  })
  await mockApexoServer(page, {
    directory,
    project: {
      id: "proj_followup_delivery",
      worktree: directory,
      vcs: "git",
      name: title,
      time: { created: 1700000000000, updated: 1700000000000 },
      sandboxes: [],
    },
    provider: {
      all: [
        {
          id: "test",
          name: "Test",
          models: {
            "test-model": { id: "test-model", name: "Test Model", limit: { context: 200000 } },
          },
        },
      ],
      connected: ["test"],
      default: { test: "test-model" },
    },
    sessions: [
      {
        id: sessionID,
        slug: sessionID,
        projectID: "proj_followup_delivery",
        directory,
        title,
        version: "dev",
        model: { providerID: "test", id: "test-model" },
        time: { created: 1700000000000, updated: 1700000000000 },
      },
    ],
    sessionStatus: { [sessionID]: { type: "busy" } },
    pageMessages: () => ({
      items: [
        {
          info: {
            id: userMessageID,
            sessionID,
            role: "user",
            time: { created: 1700000000000 },
            agent: "build",
            model: { providerID: "test", modelID: "test-model" },
          },
          parts: [{ id: "prt_original_user", sessionID, messageID: userMessageID, type: "text", text: originalPrompt }],
        },
        {
          info: {
            id: assistantMessageID,
            sessionID,
            role: "assistant",
            parentID: userMessageID,
            time: { created: 1700000001000 },
            agent: "build",
            mode: "build",
            modelID: "test-model",
            providerID: "test",
            path: { cwd: directory, root: directory },
            cost: 0,
            tokens: { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },
          },
          parts: [originalReply],
        },
      ],
    }),
  })
  const requests: unknown[] = []
  const changes: string[] = []
  await page.route(new RegExp(`/session/${sessionID}/(abort|revert|unrevert)$`), async (route) => {
    const action = route.request().url().split("/").at(-1)!
    changes.push(action)
    if (action === "abort") {
      await transport.send({
        directory,
        payload: { type: "session.status", properties: { sessionID, status: { type: "idle" } } },
      })
    }
    await route.fulfill({ json: true, headers: { "access-control-allow-origin": "*" } })
  })
  await page.route(`**/session/${sessionID}/prompt_async`, async (route) => {
    requests.push(route.request().postDataJSON())
    await route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*" } })
  })
  await page.addInitScript(() => {
    localStorage.setItem("settings.v3", JSON.stringify({ general: { newLayoutDesigns: true, followup: "steer" } }))
  })
  await page.goto(`/${base64Encode(directory)}/session/${sessionID}`)
  await transport.waitForConnection()
  await expectSessionTitle(page, title)
  const composer = page.locator('[data-component="prompt-input-v2"]')
  await expect(composer.getByRole("button", { name: "Stop", exact: true })).toBeVisible()
  const editor = composer.getByRole("textbox")
  const dock = page.locator('[data-component="session-followup-dock"]')
  return { transport, requests, changes, composer, editor, dock }
}
