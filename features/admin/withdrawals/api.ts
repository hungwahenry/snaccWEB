import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminWithdrawal, ListWithdrawalsParams, SettleWithdrawalInput } from "./types"

export function listWithdrawals(params: ListWithdrawalsParams) {
  return api.get<Paginated<AdminWithdrawal>>("/admin/withdrawals", params as QueryParams)
}

export function getWithdrawal(id: string) {
  return api.get<AdminWithdrawal>(`/admin/withdrawals/${id}`)
}

export function settleWithdrawal(id: string, input: SettleWithdrawalInput) {
  return api.post<AdminWithdrawal>(`/admin/withdrawals/${id}/settle`, input)
}

export function retryWithdrawal(id: string) {
  return api.post<AdminWithdrawal>(`/admin/withdrawals/${id}/retry`)
}
