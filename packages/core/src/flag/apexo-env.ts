// Apply legacy environment fallbacks (see ../legacy-compat.ts) before anything reads process.env.
// Import this module for its side effect first.
import { applyLegacyEnv } from "../legacy-compat"

applyLegacyEnv()
