export type FlagPlatform = "ios" | "android" | "web"

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
  min_version: string | null
  max_version: string | null
  overrides: FlagPlatformRule[]
  updated_at: string
}

export interface FlagPlatformRuleInput {
  platform: FlagPlatform
  enabled: boolean
  minVersion?: string | null
  maxVersion?: string | null
}

export interface FlagChanges {
  enabled?: boolean
  minVersion?: string | null
  maxVersion?: string | null
  /** The whole set: a platform left out loses its rule, and [] puts every platform back on the
   * flag's own window. Leave it off entirely to change nothing but the flag itself. */
  overrides?: FlagPlatformRuleInput[]
}
