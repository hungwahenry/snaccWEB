import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminSnacc, AdminSnaccDetail, SnaccListQuery } from "../types"

export function listSnaccs(query: SnaccListQuery) {
  return api.get<Paginated<AdminSnacc>>("/admin/snaccs", query)
}

export function getSnacc(id: string) {
  return api.get<AdminSnaccDetail>(`/admin/snaccs/${id}`)
}

export function deleteSnacc(id: string, reason?: string) {
  return api.del<null>(`/admin/snaccs/${id}`, { reason })
}

export function holdSnacc(id: string, reason?: string) {
  return api.post<AdminSnacc>(`/admin/snaccs/${id}/hold`, { reason })
}

export function releaseSnacc(id: string) {
  return api.post<AdminSnacc>(`/admin/snaccs/${id}/release`)
}

export function pinSnacc(id: string) {
  return api.post<AdminSnacc>(`/admin/snaccs/${id}/pin`)
}

export function unpinSnacc(id: string) {
  return api.del<AdminSnacc>(`/admin/snaccs/${id}/pin`)
}
