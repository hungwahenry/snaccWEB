import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminSnacc, ListSnaccsParams } from "./types"

export function listSnaccs(params: ListSnaccsParams) {
  return api.get<Paginated<AdminSnacc>>("/admin/snaccs", params as QueryParams)
}

export function getSnacc(id: string) {
  return api.get<AdminSnacc>(`/admin/snaccs/${id}`)
}

export function deleteSnacc(id: string, reason?: string) {
  return api.del<AdminSnacc>(`/admin/snaccs/${id}`, { reason })
}

export function restoreSnacc(id: string) {
  return api.post<AdminSnacc>(`/admin/snaccs/${id}/restore`)
}

export function pinSnacc(id: string) {
  return api.post<AdminSnacc>(`/admin/snaccs/${id}/pin`)
}

export function unpinSnacc(id: string) {
  return api.del<AdminSnacc>(`/admin/snaccs/${id}/pin`)
}
