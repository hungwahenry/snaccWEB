import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"

export type WalletAccountRow = {
  id: string
  user_id: string | null
  user: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string
  } | null
  balance: number
  frozen_at: string | null
  entries_count: number
  created_at: string
  updated_at: string
}

export type WalletEntryRow = {
  id: string
  amount: number
  balance_after: number
  transaction: {
    id: string
    type: string
    reference: string
    note: string | null
  }
  created_at: string
}

export type WalletLine = {
  id: string
  amount: number
  balance_after: number
  account:
    | { kind: "system"; slug: string }
    | { kind: "user"; user: WalletAccountRow["user"] }
}

export type WalletTransactionRow = {
  id: string
  type: string
  reference: string
  amount: number
  note: string | null
  metadata: unknown
  user: WalletAccountRow["user"]
  lines: WalletLine[]
  created_at: string
}

export type WalletDetail = WalletAccountRow & {
  pin_locked: boolean
  entries: WalletEntryRow[]
  deposits: {
    id: string
    amount: number
    status: string
    reference: string
    channel: string | null
    paid_at: string | null
    created_at: string
  }[]
  virtual_account: {
    status: string
    account_number: string | null
    bank_name: string | null
    failure_reason: string | null
  } | null
  recipients: {
    kind: string
    bank_name: string | null
    account_last4: string | null
    account_name: string | null
    last_used_at: string
  }[]
}

export type WalletSummary = {
  system: { slug: string; balance: number }[]
  users: { accounts: number; balance: number; frozen: number }
}

export type WalletQuery = Record<string, string | number | boolean>

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
