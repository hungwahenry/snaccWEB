import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminWithdrawal,
  WithdrawalListQuery,
  WithdrawalSummary,
} from "../types"

export function listWithdrawals(query: WithdrawalListQuery) {
  return api.get<Paginated<AdminWithdrawal>>("/admin/withdrawals", query)
}

export function getWithdrawalSummary() {
  return api.get<WithdrawalSummary>("/admin/withdrawals/summary")
}

export function getWithdrawal(id: string) {
  return api.get<AdminWithdrawal>(`/admin/withdrawals/${id}`)
}

export function retryWithdrawal(id: string) {
  return api.post<AdminWithdrawal>(`/admin/withdrawals/${id}/retry`)
}
