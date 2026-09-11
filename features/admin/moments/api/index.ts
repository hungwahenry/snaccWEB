import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { MomentListQuery, MomentRow } from "../types"

export function listMoments(query: MomentListQuery) {
  return api.get<Paginated<MomentRow>>("/admin/moments", query)
}

export function releaseMoment(id: string, reason?: string) {
  return api.post<MomentRow>(`/admin/moments/${id}/release`, { reason })
}

export function removeMoment(id: string, reason?: string) {
  return api.del<MomentRow>(`/admin/moments/${id}`, { reason })
}
