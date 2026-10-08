declare global {
  const APEXO_VERSION: string
  const APEXO_CHANNEL: string
}

export const InstallationVersion = typeof APEXO_VERSION === "string" ? APEXO_VERSION : "local"
export const InstallationChannel = typeof APEXO_CHANNEL === "string" ? APEXO_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
