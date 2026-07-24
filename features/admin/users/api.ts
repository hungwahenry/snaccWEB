import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminUserDetail, AdminUserRow, ListUsersParams } from "./types"

export function listUsers(params: ListUsersParams) {
  return api.get<Paginated<AdminUserRow>>("/admin/users", params as QueryParams)
}

export function getUser(id: string) {
  return api.get<AdminUserDetail>(`/admin/users/${id}`)
}

export function suspendUser(id: string, reason?: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/suspend`, { reason })
}

export function unsuspendUser(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/unsuspend`)
}

export function setRole(id: string, role: string) {
  return api.patch<AdminUserRow>(`/admin/users/${id}/role`, { role })
}

export function adjustBalance(id: string, delta: number, reason?: string) {
  return api.patch<AdminUserRow>(`/admin/users/${id}/balance`, { delta, reason })
}

export function revokeSessions(id: string) {
  return api.post<{ revoked: number }>(`/admin/users/${id}/revoke-sessions`)
}

export function deleteUser(id: string, confirmEmail: string) {
  return api.del<null>(`/admin/users/${id}`, { confirmEmail })
}
