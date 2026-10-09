import { createSimpleContext } from "../context/helper"
import { useSDK } from "../context/sdk"
import { useSync } from "../context/sync"
import { useToast } from "../ui/toast"
import { errorMessage } from "../util/error"
import { deliverPrompt } from "./delivery"
import { createPromptQueue } from "./queue"

export const { use: usePromptQueue, provider: PromptQueueProvider } = createSimpleContext({
  name: "PromptQueue",
  init: () => {
    const sdk = useSDK()
    const sync = useSync()
    const toast = useToast()
    return createPromptQueue({
      busy: (sessionID) =>
        sync.data.status !== "complete" ||
        (sync.data.session_status[sessionID]?.type ?? "idle") !== "idle" ||
        !!sync.data.permission[sessionID]?.length ||
        !!sync.data.question[sessionID]?.length,
      deliver: (draft) => deliverPrompt(sdk.client.session, sync.data.command, draft),
      onError: (error) =>
        toast.show({ title: "Failed to send prompt", message: errorMessage(error), variant: "error" }),
    })
  },
})
