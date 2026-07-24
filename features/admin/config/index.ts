import { api } from "@/lib/api/client"

export interface AdminConfigSetting {
  key: string
  value: unknown
  is_public: boolean
  category: string
  description: string
  updated_at: string
}

export function listConfig() {
  return api.get<AdminConfigSetting[]>("/admin/config")
}

export function updateConfig(key: string, body: { value?: unknown; isPublic?: boolean }) {
  return api.patch<AdminConfigSetting>(`/admin/config/${key}`, body)
}
