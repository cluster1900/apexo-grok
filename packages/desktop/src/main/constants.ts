import { app } from "electron"

type Channel = "dev" | "beta" | "prod"
const raw = import.meta.env.APEXO_CHANNEL
export const CHANNEL: Channel = raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

// Apexo has no release feed yet; the inherited feed pointed at upstream releases,
// which would "update" Apexo into a different product. Keep the updater off.
export const UPDATER_ENABLED = app.isPackaged && CHANNEL !== "dev" && false
