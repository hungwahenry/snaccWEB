import { api } from "@/lib/api/client"

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

export function listFlags() {
  return api.get<AdminFeatureFlag[]>("/admin/flags")
}

/** Only the fields passed are touched; a bound left out keeps whatever it had. */
export function updateFlag(key: string, changes: FlagChanges) {
  return api.patch<AdminFeatureFlag>(`/admin/flags/${key}`, changes)
}
