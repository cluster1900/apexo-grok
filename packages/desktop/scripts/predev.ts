import { $ } from "bun"
import { downloadCliToResources } from "./utils"

await $`bun run install-electron`

await $`bun ./scripts/copy-icons.ts ${process.env.APEXO_CHANNEL ?? "dev"}`

await $`cd ../apexo && bun script/build-node.ts`
await downloadCliToResources()
