import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { SuspendInput } from "@/features/admin/suspension-reasons/types"
import type {
  AdjustEarningsInput,
  AdminUserDetail,
  AdminUserRow,
  UserListQuery,
} from "../types"

export function listUsers(query: UserListQuery) {
  return api.get<Paginated<AdminUserRow>>("/admin/users", query)
}

export function getUser(id: string) {
  return api.get<AdminUserDetail>(`/admin/users/${id}`)
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

export function blockPayouts(id: string, reason?: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/block-payouts`, { reason })
}

export function unblockPayouts(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/unblock-payouts`)
}

export function makeGlobal(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/reach/global`)
}

export function makeCampusBound(id: string) {
  return api.post<AdminUserRow>(`/admin/users/${id}/reach/campus`)
}

export function setUserUniversity(id: string, universityId: string) {
  return api.patch<AdminUserRow>(`/admin/users/${id}/university`, {
    universityId,
  })
}

/** Moves unclaimed earnings, not the wallet. Wallet corrections live under Wallets. */
export function adjustEarnings(id: string, input: AdjustEarningsInput) {
  return api.patch<AdminUserRow>(`/admin/users/${id}/balance`, input)
}

export function revokeSessions(id: string) {
  return api.post<{ revoked: number }>(`/admin/users/${id}/revoke-sessions`)
}

export function deleteUser(id: string, confirmEmail: string) {
  return api.del<null>(`/admin/users/${id}`, { confirmEmail })
}
