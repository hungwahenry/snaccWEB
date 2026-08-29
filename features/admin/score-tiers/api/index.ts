import { api } from "@/lib/api/client"
import type { AdminTier, CreateTierInput, UpdateTierInput } from "../types"

export function listTiers() {
  return api.get<AdminTier[]>("/admin/score-tiers")
}

export function createTier(input: CreateTierInput) {
  return api.post<AdminTier>("/admin/score-tiers", input)
}

export function updateTier(id: string, input: UpdateTierInput) {
  return api.patch<AdminTier>(`/admin/score-tiers/${id}`, input)
}

export function deleteTier(id: string) {
  return api.del<null>(`/admin/score-tiers/${id}`)
}
