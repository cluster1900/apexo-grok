// @ts-nocheck
import { Button } from "@apexo/ui/button"
import { useDialog } from "@apexo/ui/context/dialog"
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query"
import { mockProviderAuth } from "@/context/server-sync"
import { onCleanup, onMount } from "solid-js"
import { DialogConnectProvider, useProviderConnectController } from "./dialog-connect-provider"

function ConnectProviderDialogStory() {
  const dialog = useDialog()
  const open = () => dialog.show(() => <DialogConnectProvider />)

  onMount(open)

  return (
    <Button variant="secondary" onClick={open}>
      Open connect provider dialog
    </Button>
  )
}

function ProviderConnectionDialogStory(props) {
  onCleanup(mockProviderAuth(props.provider, props.methods))
  const dialog = useDialog()
  const controller = useProviderConnectController()
  controller.select(props.provider)
  const open = () => dialog.show(() => <DialogConnectProvider controller={controller} />)

  onMount(open)

  return (
    <Button variant="secondary" onClick={open}>
      Open {props.provider} connection dialog
    </Button>
  )
}

function renderConnection(provider, methods) {
  return () => (
    <QueryClientProvider client={new QueryClient()}>
      <ProviderConnectionDialogStory provider={provider} methods={methods} />
    </QueryClientProvider>
  )
}

export default {
  title: "App/Dialogs/Connect Provider",
  id: "app-dialog-connect-provider",
}

export const V2 = {
  render: () => (
    <QueryClientProvider client={new QueryClient()}>
      <ConnectProviderDialogStory />
    </QueryClientProvider>
  ),
}

export const ApiKey = {
  render: renderConnection("openai", [{ type: "api", label: "API key" }]),
}

export const LoginMethods = {
  render: renderConnection("xai", [
    { type: "oauth", label: "SuperGrok Subscription" },
    { type: "api", label: "Manually enter API Key" },
  ]),
}
