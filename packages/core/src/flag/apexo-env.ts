// Apexo environment aliases.
//
// Apexo is derived from OpenCode and the codebase still reads OPENCODE_* variables
// internally. To let users configure Apexo with APEXO_* names without renaming every
// call site, mirror each APEXO_<NAME> into OPENCODE_<NAME> as early as possible.
// APEXO_* wins when both are set; OPENCODE_* keeps working when APEXO_* is absent.
//
// Import this module for its side effect before anything that reads process.env.
export const PREFIX = "APEXO_"
export const LEGACY_PREFIX = "OPENCODE_"

export function applyApexoEnvAliases(env: Record<string, string | undefined> = process.env) {
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith(PREFIX) || value === undefined) continue
    env[LEGACY_PREFIX + key.slice(PREFIX.length)] = value
  }
  // Bare APEXO=1 marker mirrors OPENCODE=1 (set by the CLI for child processes).
  if (env.APEXO !== undefined && env.OPENCODE === undefined) env.OPENCODE = env.APEXO
}

applyApexoEnvAliases()
