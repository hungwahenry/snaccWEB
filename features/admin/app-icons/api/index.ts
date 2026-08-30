import { api } from "@/lib/api/client"
import type { AdminAppIcon, UpdateAppIconInput } from "../types"

export function listAppIcons() {
  return api.get<AdminAppIcon[]>("/admin/app-icons")
}

export function updateAppIcon(id: string, input: UpdateAppIconInput) {
  return api.patch<AdminAppIcon>(`/admin/app-icons/${id}`, input)
}
