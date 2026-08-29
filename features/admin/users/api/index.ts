import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminUserDetail, AdminUserRow, ListUsersParams } from "../types"

export function listUsers(params: ListUsersParams) {
  return api.get<Paginated<AdminUserRow>>("/admin/users", params as QueryParams)
}

export function getUser(id: string) {
  return api.get<AdminUserDetail>(`/admin/users/${id}`)
}

export interface SuspendInput {
  reasonId?: string
  note?: string
  until?: string
}

export function suspendUser(id: string, input: SuspendInput) {
  return api.post<AdminUserRow>(`/admin/users/${id}/suspend`, input)
}

export function unsuspendUser(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/unsuspend`)
}

export function pauseEarnings(id: string, reason?: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/pause-earnings`, { reason })
}

export function resumeEarnings(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/resume-earnings`)
}

export function makeGlobal(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/reach/global`)
}

export function makeCampusBound(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/reach/campus`)
}

export function blockPayouts(id: string, reason?: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/block-payouts`, { reason })
}

export function unblockPayouts(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/unblock-payouts`)
}

export function adjustBalance(id: string, delta: number, reason?: string) {
  return api.patch<AdminUserRow>(`/admin/users/${id}/balance`, {
    delta,
    reason,
  })
}

export function revokeSessions(id: string) {
  return api.post<{ revoked: number }>(`/admin/users/${id}/revoke-sessions`)
}

export function deleteUser(id: string, confirmEmail: string) {
  return api.del<null>(`/admin/users/${id}`, { confirmEmail })
}
