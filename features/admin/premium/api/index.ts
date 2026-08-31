import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminBenefit,
  AdminSubscriber,
  PremiumStats,
  SubscriberFilters,
  UpdateBenefitInput,
} from "../types"

export function listSubscribers(params: SubscriberFilters) {
  return api.get<Paginated<AdminSubscriber>>(
    "/admin/premium",
    params as QueryParams
  )
}

export function premiumStats() {
  return api.get<PremiumStats>("/admin/premium/stats")
}

export function listBenefits() {
  return api.get<AdminBenefit[]>("/admin/premium/benefits")
}

export function updateBenefit(id: string, input: UpdateBenefitInput) {
  return api.patch<AdminBenefit>(`/admin/premium/benefits/${id}`, input)
}

export function grantPremium(userId: string, days: number, reason: string) {
  return api.post<{ until: string | null }>(`/admin/premium/users/${userId}/grant`, {
    days,
    reason,
  })
}

export function revokePremium(userId: string, reason: string) {
  return api.post(`/admin/premium/users/${userId}/revoke`, { reason })
}
