#!/usr/bin/env bun
import { $ } from "bun"

import { stageCliToResources, resolveChannel } from "./utils"

const channel = resolveChannel()
await $`bun ./scripts/copy-icons.ts ${channel}`
await $`bun ./scripts/copy-metainfo.ts ${channel}`

await $`cd ../apexo && bun script/build-node.ts`
if (channel === "dev") await stageCliToResources()
