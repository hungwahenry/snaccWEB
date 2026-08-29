import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminWithdrawal,
  ListWithdrawalsParams,
  WithdrawalSummary,
} from "./types"

export function listWithdrawals(params: ListWithdrawalsParams) {
  return api.get<Paginated<AdminWithdrawal>>(
    "/admin/withdrawals",
    params as QueryParams
  )
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
