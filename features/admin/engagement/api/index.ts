import { api } from "@/lib/api/client"
import type { AdminEngagementKind, UpdateEngagementInput } from "../types"

export function listEngagement() {
  return api.get<AdminEngagementKind[]>("/admin/engagement")
}

export function updateEngagement(key: string, input: UpdateEngagementInput) {
  return api.patch<AdminEngagementKind>(`/admin/engagement/${key}`, input)
}

export function resetEngagement(key: string) {
  return api.post<AdminEngagementKind>(`/admin/engagement/${key}/reset`)
}
