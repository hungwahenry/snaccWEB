import { api } from "@/lib/api/client"

export interface AdminFeatureFlag {
  key: string
  enabled: boolean
  category: string
  description: string
  updated_at: string
}

export function listFlags() {
  return api.get<AdminFeatureFlag[]>("/admin/flags")
}

export function updateFlag(key: string, enabled: boolean) {
  return api.patch<AdminFeatureFlag>(`/admin/flags/${key}`, { enabled })
}
