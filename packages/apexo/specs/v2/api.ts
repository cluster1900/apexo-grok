// @ts-nocheck

import { Apexo } from "@apexo/core"
import { ReadTool } from "@apexo/core/tools"

const apexo = Apexo.make({})

apexo.tool.add(ReadTool)

apexo.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

apexo.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

apexo.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await apexo.session.create({
  agent: "build",
})

apexo.subscribe((event) => {
  console.log(event)
})

await apexo.session.prompt({
  sessionID,
  text: "hey what is up",
})

await apexo.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await apexo.session.wait()

console.log(await apexo.session.messages(sessionID))
