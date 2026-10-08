export interface OpenAICompatibleProfile {
  readonly provider: string
  readonly baseURL: string
}

export const profiles = {
  xai: { provider: "xai", baseURL: "https://api.x.ai/v1" },
} as const satisfies Record<string, OpenAICompatibleProfile>

export const byProvider: Record<string, OpenAICompatibleProfile> = Object.fromEntries(
  Object.values(profiles).map((profile) => [profile.provider, profile]),
)
