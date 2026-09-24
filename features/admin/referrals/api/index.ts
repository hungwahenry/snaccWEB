import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminReferral, ReferralListQuery } from "../types"

export function listReferrals(query: ReferralListQuery) {
  return api.get<Paginated<AdminReferral>>("/admin/referrals", query)
}

export function approveReferral(id: string) {
  return api.post<AdminReferral>(`/admin/referrals/${id}/approve`)
}

export function voidReferral(id: string, reason: string) {
  return api.post<AdminReferral>(`/admin/referrals/${id}/void`, { reason })
}
