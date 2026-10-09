import { describe, expect, it } from "bun:test"
import { Effect, Schema } from "effect"
import { ModelV2 } from "@apexo/core/model"
import { ProviderV2 } from "@apexo/core/provider"
import { Credential } from "@apexo/core/credential"
import { SessionRunnerModel } from "@apexo/core/session/runner/model"
import { OpenAIOptions } from "@apexo/llm/protocols/openai-responses"
import { LLM } from "@apexo/llm"
import { WriteTool } from "@apexo/core/tool/write"
import { ReadTool } from "@apexo/core/tool/read"
import { EditTool } from "@apexo/core/tool/edit"
import { BashTool } from "@apexo/core/tool/bash"

describe("Grok & xAI V2 Compatibility", () => {
  const grokProviderID = ProviderV2.ID.make("xai")
  const grokModelID = ModelV2.ID.make("grok-4")
  const grokModelInfo: ModelV2.Info = {
    ...ModelV2.Info.empty(grokProviderID, grokModelID),
    name: "Grok 4",
    api: {
      type: "aisdk",
      package: "@ai-sdk/xai",
      id: grokModelID,
    },
    limit: {
      context: 128_000,
      output: 8_192,
    },
  }

  it("SessionRunnerModel.supported recognizes @ai-sdk/xai models", () => {
    expect(SessionRunnerModel.supported(grokModelInfo)).toBe(true)
  })

  it("SessionRunnerModel.fromCatalogModel resolves an xAI model with https://api.x.ai/v1", async () => {
    const cred: Credential.Key = {
      type: "key",
      key: "xai-test-secret-key",
    }

    const model = await Effect.runPromise(SessionRunnerModel.fromCatalogModel(grokModelInfo, cred))
    expect(String(model.id)).toBe("grok-4")
    expect(String(model.provider)).toBe("xai")
    expect(model.route.endpoint.baseURL).toBe("https://api.x.ai/v1")
    expect(model.route.defaults.providerOptions?.xai?.store).toBe(false)
  })

  it("OpenAIOptions extracts options from request.providerOptions.xai", async () => {
    const model = await Effect.runPromise(SessionRunnerModel.fromCatalogModel(grokModelInfo))
    const request = LLM.request({
      model,
      providerOptions: {
        xai: {
          store: false,
          promptCacheKey: "test-cache-key-123",
          reasoningEffort: "high",
        },
      },
    })

    expect(OpenAIOptions.store(request)).toBe(false)
    expect(OpenAIOptions.promptCacheKey(request)).toBe("test-cache-key-123")
    expect(OpenAIOptions.reasoningEffort(request)).toBe("high")
  })

  it("WriteTool accepts filePath in addition to path", () => {
    const decodedWithPath = Schema.decodeUnknownSync(WriteTool.Input)({
      path: "hello.txt",
      content: "world",
    })
    expect(decodedWithPath.path).toBe("hello.txt")

    const decodedWithFilePath = Schema.decodeUnknownSync(WriteTool.Input)({
      filePath: "hello.txt",
      content: "world",
    })
    expect(decodedWithFilePath.filePath).toBe("hello.txt")
  })

  it("ReadTool accepts filePath in addition to path", () => {
    const decodedWithPath = Schema.decodeUnknownSync(ReadTool.Input)({
      path: "hello.txt",
    })
    expect(decodedWithPath.path).toBe("hello.txt")

    const decodedWithFilePath = Schema.decodeUnknownSync(ReadTool.Input)({
      filePath: "hello.txt",
    })
    expect(decodedWithFilePath.filePath).toBe("hello.txt")
  })

  it("EditTool accepts filePath in addition to path", () => {
    const decodedWithPath = Schema.decodeUnknownSync(EditTool.Input)({
      path: "hello.txt",
      oldString: "foo",
      newString: "bar",
    })
    expect(decodedWithPath.path).toBe("hello.txt")

    const decodedWithFilePath = Schema.decodeUnknownSync(EditTool.Input)({
      filePath: "hello.txt",
      oldString: "foo",
      newString: "bar",
    })
    expect(decodedWithFilePath.filePath).toBe("hello.txt")
  })

  it("BashTool accepts cmd in addition to command", () => {
    const decodedWithCommand = Schema.decodeUnknownSync(BashTool.Input)({
      command: "echo 1",
    })
    expect(decodedWithCommand.command).toBe("echo 1")

    const decodedWithCmd = Schema.decodeUnknownSync(BashTool.Input)({
      cmd: "echo 1",
    })
    expect(decodedWithCmd.cmd).toBe("echo 1")
  })

  it("BashTool rejects input without a command", () => {
    expect(() => Schema.decodeUnknownSync(BashTool.Input)({})).toThrow("command or cmd is required")
  })
})
