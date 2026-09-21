import { api } from "@/lib/api/client"
import type { AdminFeatureFlag, FlagMember, UpdateFlagInput } from "../types"

export function listFlags() {
  return api.get<AdminFeatureFlag[]>("/admin/flags")
}

export function updateFlag(key: string, input: UpdateFlagInput) {
  return api.patch<AdminFeatureFlag>(`/admin/flags/${key}`, input)
}

export function listFlagMembers(key: string) {
  return api.get<FlagMember[]>(`/admin/flags/${key}/members`)
}

export function addFlagMember(key: string, username: string) {
  return api.post<FlagMember>(`/admin/flags/${key}/members`, { username })
}

export function removeFlagMember(key: string, userId: string) {
  return api.del<null>(`/admin/flags/${key}/members/${userId}`)
}
