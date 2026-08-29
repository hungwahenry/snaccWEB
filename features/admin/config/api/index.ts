import type { AdminConfigSetting } from "../types"
import { api } from "@/lib/api/client"

export function listConfig() {
  return api.get<AdminConfigSetting[]>("/admin/config")
}

export function updateConfig(
  key: string,
  body: { value?: unknown; isPublic?: boolean }
) {
  return api.patch<AdminConfigSetting>(`/admin/config/${key}`, body)
}
