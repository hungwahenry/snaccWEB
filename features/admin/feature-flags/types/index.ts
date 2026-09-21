import type { UserRefWithCampus } from "@/lib/api/types"

export type FlagPlatform = "ios" | "android" | "web"

export type FlagAudience = "everyone" | "premium" | "listed"

export interface FlagPlatformRule {
  platform: FlagPlatform
  enabled: boolean
  min_version: string | null
  max_version: string | null
}

export interface AdminFeatureFlag {
  key: string
  enabled: boolean
  category: string
  description: string
  is_public: boolean
  audience: FlagAudience
  member_count: number
  min_version: string | null
  max_version: string | null
  overrides: FlagPlatformRule[]
  updated_at: string
}

export interface FlagMember {
  user: UserRefWithCampus
  added_at: string
}

export interface FlagPlatformRuleInput {
  platform: FlagPlatform
  enabled: boolean
  minVersion?: string | null
  maxVersion?: string | null
}

export interface UpdateFlagInput {
  enabled?: boolean
  audience?: FlagAudience
  minVersion?: string | null
  maxVersion?: string | null
  overrides?: FlagPlatformRuleInput[]
}

export interface VersionWindow {
  min_version: string | null
  max_version: string | null
}

export interface FlagRuleDraft {
  enabled: boolean
  min: string
  max: string
}

export interface FlagDraft {
  audience: FlagAudience
  min: string
  max: string
  rules: Partial<Record<FlagPlatform, FlagRuleDraft>>
}

export interface WindowErrors {
  min: string | null
  max: string | null
}

export interface FlagGroup {
  category: string
  flags: AdminFeatureFlag[]
}
