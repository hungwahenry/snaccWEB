import { api } from "@/lib/api/client"
import type {
  AdminBadge,
  BadgeHolder,
  CreateBadgeInput,
  GrantBadgeInput,
  UpdateBadgeInput,
} from "./types"

export function listBadges() {
  return api.get<AdminBadge[]>("/admin/badges")
}

export function createBadge(input: CreateBadgeInput) {
  return api.post<AdminBadge>("/admin/badges", input)
}

export function updateBadge(id: string, input: UpdateBadgeInput) {
  return api.patch<AdminBadge>(`/admin/badges/${id}`, input)
}

export function deleteBadge(id: string) {
  return api.del<null>(`/admin/badges/${id}`)
}

export function listHolders(id: string) {
  return api.get<BadgeHolder[]>(`/admin/badges/${id}/holders`)
}

export function grantBadge(id: string, input: GrantBadgeInput) {
  return api.post<unknown>(`/admin/badges/${id}/grants`, input)
}

export function revokeBadge(id: string, userId: string) {
  return api.del<null>(`/admin/badges/${id}/grants/${userId}`)
}
