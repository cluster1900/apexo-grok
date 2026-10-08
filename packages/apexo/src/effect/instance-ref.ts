import { Context } from "effect"
import type { InstanceContext } from "@/project/instance-context"
import type { WorkspaceV2 } from "@apexo/core/workspace"

export const InstanceRef = Context.Reference<InstanceContext | undefined>("~apexo/InstanceRef", {
  defaultValue: () => undefined,
})

export const WorkspaceRef = Context.Reference<WorkspaceV2.ID | undefined>("~apexo/WorkspaceRef", {
  defaultValue: () => undefined,
})
