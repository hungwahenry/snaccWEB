import type { UserRefWithCampus } from "@/lib/api/types"

export type TransactionType =
  | "earnings_claim"
  | "transfer"
  | "withdrawal"
  | "withdrawal_reversal"
  | "deposit"
  | "adjustment"
  | "premium"

export type DepositStatus = "pending" | "success" | "abandoned"

export type VirtualAccountStatus = "pending" | "active" | "failed"

export interface WalletAccountRow {
  id: string
  user_id: string | null
  user: UserRefWithCampus | null
  balance: number
  frozen_at: string | null
  entries_count: number
  created_at: string
  updated_at: string
}

export interface WalletEntryRow {
  id: string
  amount: number
  balance_after: number
  transaction: {
    id: string
    type: TransactionType
    reference: string
    note: string | null
  }
  created_at: string
}

export interface WalletLine {
  id: string
  amount: number
  balance_after: number
  account:
    | { kind: "system"; slug: string }
    | { kind: "user"; user: UserRefWithCampus | null }
}

export interface WalletTransactionRow {
  id: string
  type: TransactionType
  reference: string
  amount: number
  note: string | null
  metadata: unknown
  user: UserRefWithCampus | null
  lines: WalletLine[]
  created_at: string
}

export interface WalletDeposit {
  id: string
  amount: number
  status: DepositStatus
  reference: string
  channel: string | null
  paid_at: string | null
  created_at: string
}

export interface WalletRecipient {
  kind: "user" | "bank"
  bank_name: string | null
  account_last4: string | null
  account_name: string | null
  last_used_at: string
}

export interface WalletDetail extends WalletAccountRow {
  pin_locked: boolean
  entries: WalletEntryRow[]
  deposits: WalletDeposit[]
  virtual_account: {
    status: VirtualAccountStatus
    account_number: string | null
    bank_name: string | null
    failure_reason: string | null
  } | null
  recipients: WalletRecipient[]
}

export interface WalletSummary {
  system: { slug: string; balance: number }[]
  users: { accounts: number; balance: number; frozen: number }
}

export type WalletAccountListQuery = {
  page: number
  perPage: number
  q?: string
  frozen?: boolean
  funded?: boolean
}

export type WalletTransactionListQuery = {
  page: number
  perPage: number
  q?: string
  type?: TransactionType
  userId?: string
}

export interface AdjustWalletInput {
  delta: number
  reason: string
}
