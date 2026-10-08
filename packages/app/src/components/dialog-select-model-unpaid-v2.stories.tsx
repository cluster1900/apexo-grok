// @ts-nocheck
import { Button } from "@apexo/ui/button"
import { useDialog } from "@apexo/ui/context/dialog"
import { createSignal, onMount } from "solid-js"
import { DialogSelectModelUnpaidV2 } from "./dialog-select-model-unpaid-v2"

const names = ["Llama 3.3 70B", "Qwen3 Coder 30B", "Gemma 3 27B", "Mistral Small 3.2", "Phi-4", "GPT-OSS 20B"]

function SelectModelWithoutProviders() {
  const dialog = useDialog()
  const models = names.map((name, index) => ({
    id: name.toLowerCase().replaceAll(" ", "-"),
    name,
    provider: { id: "ollama", name: "Ollama (local)" },
    cost: { input: 0, output: 0 },
    limit: { context: 128_000 },
    capabilities: {
      reasoning: index !== 5,
      input: { text: true, image: false, audio: false, video: false, pdf: false },
    },
  }))
  const [current, setCurrent] = createSignal(models[2])
  const model = {
    list: () => models,
    current,
    set(value) {
      setCurrent(models.find((item) => item.id === value?.modelID))
    },
  }
  const open = () => dialog.show(() => <DialogSelectModelUnpaidV2 model={model} />)

  onMount(open)

  return (
    <Button variant="secondary" onClick={open}>
      Open select model dialog
    </Button>
  )
}

export default {
  title: "App/Dialogs/Select Model",
  id: "app-dialog-select-model",
}

export const WithoutProviders = {
  render: () => <SelectModelWithoutProviders />,
}
