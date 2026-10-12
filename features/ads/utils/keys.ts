import type { AdAudience } from "../types"

export const adKeys = {
  campaigns: () => ["ads", "campaigns"] as const,
  campaign: (id: string) => ["ads", "campaign", id] as const,
  policy: () => ["ads", "policy"] as const,
  buttons: () => ["ads", "buttons"] as const,
  reach: (audience: AdAudience) => ["ads", "reach", audience] as const,
}
