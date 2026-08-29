import type { AdminFeatureFlag, FlagChanges } from "../types"
import { api } from "@/lib/api/client"

export function listFlags() {
  return api.get<AdminFeatureFlag[]>("/admin/flags")
}

export function updateFlag(key: string, changes: FlagChanges) {
  return api.patch<AdminFeatureFlag>(`/admin/flags/${key}`, changes)
}
