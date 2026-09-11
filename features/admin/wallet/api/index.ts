import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdjustWalletInput,
  WalletAccountListQuery,
  WalletAccountRow,
  WalletDetail,
  WalletSummary,
  WalletTransactionListQuery,
  WalletTransactionRow,
} from "../types"

export function getWalletSummary() {
  return api.get<WalletSummary>("/admin/wallet/summary")
}

export function listWalletAccounts(query: WalletAccountListQuery) {
  return api.get<Paginated<WalletAccountRow>>("/admin/wallet/accounts", query)
}

export function getWallet(userId: string) {
  return api.get<WalletDetail>(`/admin/wallet/accounts/${userId}`)
}

export function listWalletTransactions(query: WalletTransactionListQuery) {
  return api.get<Paginated<WalletTransactionRow>>(
    "/admin/wallet/transactions",
    query
  )
}

export function freezeWallet(userId: string, reason?: string) {
  return api.post<WalletAccountRow>(`/admin/wallet/accounts/${userId}/freeze`, {
    reason,
  })
}

export function unfreezeWallet(userId: string) {
  return api.post<WalletAccountRow>(
    `/admin/wallet/accounts/${userId}/unfreeze`,
    {}
  )
}

export function adjustWallet(userId: string, input: AdjustWalletInput) {
  return api.post<WalletAccountRow>(
    `/admin/wallet/accounts/${userId}/adjust`,
    input
  )
}
