export interface AdminFeatureFlag {
  key: string
  enabled: boolean
  category: string
  description: string
  min_version: string | null
  max_version: string | null
  updated_at: string
}

export interface FlagChanges {
  enabled?: boolean
  minVersion?: string | null
  maxVersion?: string | null
}
