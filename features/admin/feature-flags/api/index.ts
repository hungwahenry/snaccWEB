import { api } from "@/lib/api/client"
import type { AdminFeatureFlag, UpdateFlagInput } from "../types"

export function listFlags() {
  return api.get<AdminFeatureFlag[]>("/admin/flags")
}

export function updateFlag(key: string, input: UpdateFlagInput) {
  return api.patch<AdminFeatureFlag>(`/admin/flags/${key}`, input)
}
