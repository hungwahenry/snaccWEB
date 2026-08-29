import type { AdminEngagementKind, EngagementChanges } from "../types"
import { api } from "@/lib/api/client"

export function listEngagement() {
  return api.get<AdminEngagementKind[]>("/admin/engagement")
}

export function updateEngagement(key: string, body: EngagementChanges) {
  return api.patch<AdminEngagementKind>(`/admin/engagement/${key}`, body)
}

export function resetEngagement(key: string) {
  return api.post<AdminEngagementKind>(`/admin/engagement/${key}/reset`, {})
}
