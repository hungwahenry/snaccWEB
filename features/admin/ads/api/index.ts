import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdButton,
  AdListQuery,
  AdminAd,
  AdReason,
  AdStats,
  CampusPrice,
  CreateAdButtonInput,
  CreateAdReasonInput,
  PriceListQuery,
  RejectAdInput,
  UpdateAdButtonInput,
  UpdateAdReasonInput,
} from "../types"
import type { Money } from "@/lib/money"

export function listAds(query: AdListQuery) {
  return api.get<Paginated<AdminAd>>("/admin/ads", query)
}

export function getAdStats() {
  return api.get<AdStats>("/admin/ads/stats")
}

export function getAd(id: string) {
  return api.get<AdminAd>(`/admin/ads/${id}`)
}

export function approveAd(id: string) {
  return api.post<AdminAd>(`/admin/ads/${id}/approve`)
}

export function rejectAd(id: string, input: RejectAdInput) {
  return api.post<AdminAd>(`/admin/ads/${id}/reject`, input)
}

export function pauseAd(id: string) {
  return api.post<AdminAd>(`/admin/ads/${id}/pause`)
}

export function resumeAd(id: string) {
  return api.post<AdminAd>(`/admin/ads/${id}/resume`)
}

export function endAd(id: string) {
  return api.post<AdminAd>(`/admin/ads/${id}/end`)
}

export function listAdPrices(query: PriceListQuery) {
  return api.get<Paginated<CampusPrice>>("/admin/ads/prices", query)
}

export function setAdPrice(universityId: string, pricePerThousand: Money) {
  return api.put<null>(`/admin/ads/prices/${universityId}`, {
    pricePerThousand,
  })
}

export function clearAdPrice(universityId: string) {
  return api.del<null>(`/admin/ads/prices/${universityId}`)
}

export function listAdReasons() {
  return api.get<AdReason[]>("/admin/ads/reasons")
}

export function createAdReason(input: CreateAdReasonInput) {
  return api.post<AdReason>("/admin/ads/reasons", input)
}

export function updateAdReason(id: string, input: UpdateAdReasonInput) {
  return api.patch<AdReason>(`/admin/ads/reasons/${id}`, input)
}

export function listAdButtons() {
  return api.get<AdButton[]>("/admin/ads/buttons")
}

export function createAdButton(input: CreateAdButtonInput) {
  return api.post<AdButton>("/admin/ads/buttons", input)
}

export function updateAdButton(id: string, input: UpdateAdButtonInput) {
  return api.patch<AdButton>(`/admin/ads/buttons/${id}`, input)
}
