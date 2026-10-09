export function shouldQueueFollowup(input: {
  busy: boolean
  pending: boolean
  mode: "normal" | "shell"
  newSession: boolean
}) {
  if (input.newSession || input.mode !== "normal") return false
  return input.busy || input.pending
}
