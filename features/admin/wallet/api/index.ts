import type {
  WalletAccountRow,
  WalletDetail,
  WalletQuery,
  WalletSummary,
  WalletTransactionRow,
} from "../types"
import type { UserRef } from "@/lib/api/types"
import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"

export function getWalletSummary() {
  return api.get<WalletSummary>("/admin/wallet/summary")
}

export function listWalletAccounts(params: WalletQuery) {
  return api.get<Paginated<WalletAccountRow>>("/admin/wallet/accounts", params)
}

export function getWallet(userId: string) {
  return api.get<WalletDetail>(`/admin/wallet/accounts/${userId}`)
}

export function listWalletTransactions(params: WalletQuery) {
  return api.get<Paginated<WalletTransactionRow>>(
    "/admin/wallet/transactions",
    params
  )
}

export function freezeWallet(userId: string, frozen: boolean, reason?: string) {
  return api.post<WalletAccountRow>(
    `/admin/wallet/accounts/${userId}/${frozen ? "freeze" : "unfreeze"}`,
    { reason }
  )
}

export function adjustWallet(userId: string, delta: number, reason: string) {
  return api.post<WalletAccountRow>(`/admin/wallet/accounts/${userId}/adjust`, {
    delta,
    reason,
  })
}
