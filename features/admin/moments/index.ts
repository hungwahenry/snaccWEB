import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { CellUser } from "../shared/user-cell"

export type MomentRow = {
  id: string
  body: string | null
  background: string | null
  image_url: string | null
  author: CellUser
  views_count: number
  reports_count: number
  held_at: string | null
  deleted_at: string | null
  expires_at: string
  created_at: string
}

export function listMoments(params: Record<string, string | number | boolean>) {
  return api.get<Paginated<MomentRow>>("/admin/moments", params)
}

export function releaseMoment(id: string, reason?: string) {
  return api.post<MomentRow>(`/admin/moments/${id}/release`, { reason })
}

export function removeMoment(id: string, reason?: string) {
  return api.del<MomentRow>(`/admin/moments/${id}`, { reason })
}
