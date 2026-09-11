import { api } from "@/lib/api/client"
import type { AdminConfigSetting, UpdateConfigInput } from "../types"

export function listConfig() {
  return api.get<AdminConfigSetting[]>("/admin/config")
}

export function updateConfig(key: string, input: UpdateConfigInput) {
  return api.patch<AdminConfigSetting>(`/admin/config/${key}`, input)
}
