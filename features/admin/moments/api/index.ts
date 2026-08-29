import type { MomentRow } from "../types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { CellUser } from "@/components/admin/user-cell"

export function listMoments(params: Record<string, string | number | boolean>) {
  return api.get<Paginated<MomentRow>>("/admin/moments", params)
}

export function releaseMoment(id: string, reason?: string) {
  return api.post<MomentRow>(`/admin/moments/${id}/release`, { reason })
}

export function removeMoment(id: string, reason?: string) {
  return api.del<MomentRow>(`/admin/moments/${id}`, { reason })
}
