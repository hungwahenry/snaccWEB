import type { PayoutMethod } from "@/features/wallet/types"
import type { UserRefWithCampus } from "@/lib/api/types"
import type { Money } from "@/lib/money"

export type TransactionType =
  | "earning"
  | "earnings_claim"
  | "transfer"
  | "withdrawal"
  | "withdrawal_reversal"
  | "deposit"
  | "adjustment"
  | "premium"
  | "ad_budget"
  | "ad_refund"
  | "ad_spend"

export type DepositStatus = "pending" | "success" | "abandoned"

export type VirtualAccountStatus = "pending" | "active" | "failed"

export interface WalletAccountRow {
  id: string
  user_id: string | null
  user: UserRefWithCampus | null
  balance: Money
  frozen_at: string | null
  entries_count: number
  created_at: string
  updated_at: string
}

export interface WalletEntryRow {
  id: string
  amount: Money
  balance_after: Money
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
  amount: Money
  balance_after: Money
  account:
    | { kind: "system"; slug: string }
    | { kind: "user" | "earnings"; user: UserRefWithCampus | null }
}

export interface WalletTransactionRow {
  id: string
  type: TransactionType
  reference: string
  amount: Money
  note: string | null
  metadata: unknown
  user: UserRefWithCampus | null
  lines: WalletLine[]
  created_at: string
}

export interface WalletDeposit {
  id: string
  amount: Money
  status: DepositStatus
  reference: string
  channel: string | null
  paid_at: string | null
  created_at: string
}

export interface PayoutDestination {
  id: string
  provider: string
  method: PayoutMethod
  bank_name: string
  account_last4: string
  account_name: string
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
  destinations: PayoutDestination[]
}

export interface WalletSummary {
  currency: string
  system: { slug: string; balance: Money }[]
  users: { accounts: number; balance: Money; frozen: number }
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
  delta: Money
  reason: string
}
