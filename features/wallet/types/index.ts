import type { WalletMilestone } from "@/features/earnings/types"
import type { FollowUser } from "@/features/follows/types"

export interface Bank {
  name: string
  code: string
}

export interface WalletOverview {
  balance: number
  frozen: boolean
  pin_set: boolean
  earnings: {
    balance: number
    claimable: boolean
    milestones: WalletMilestone[]
  }
}

export type WalletTransactionType =
  | "earnings_claim"
  | "transfer"
  | "withdrawal"
  | "withdrawal_reversal"
  | "deposit"
  | "adjustment"

export interface WalletTransaction {
  id: string
  type: WalletTransactionType
  label: string
  amount: number
  direction: "in" | "out"
  balance_after: number
  note: string | null
  created_at: string
}

export type HistoryKind = "sent" | "received" | "topups" | "bank" | "earnings"

export interface WalletMonthSummary {
  month: string
  in: number
  out: number
  by_type: Partial<Record<WalletTransactionType, number>>
}

export type LimitTier = "basic" | "verified"

export interface RailUsage {
  limit: number
  used: number
}

export interface WalletLimits {
  tier: LimitTier
  send: RailUsage
  bank_send: RailUsage
  deposit: RailUsage
}

export interface WalletTransactionDetail extends WalletTransaction {
  reference: string
  fee: number
  total: number
  status: string
  channel: string | null
  counterparty: FollowUser | null
  context:
    | { kind: "request"; note: string | null }
    | { kind: "conversation"; id: string }
    | null
  delivery: {
    status: string
    bank_name: string
    account_last4: string
    account_name: string
    timeline: { status: string; at: string }[]
  } | null
}

export interface WalletRecipient {
  id: string
  kind: "user" | "bank"
  last_used_at: string
  times_used: number
  user: FollowUser | null
  bank: {
    bank_code: string
    bank_name: string
    account_last4: string
    account_name: string
  } | null
}

export type MoneyRequestStatus =
  "pending" | "paid" | "declined" | "cancelled" | "expired"

export interface MoneyRequest {
  id: string
  amount: number
  note: string | null
  status: MoneyRequestStatus
  requester: FollowUser
  target: FollowUser
  expires_at: string
  created_at: string
  resolved_at: string | null
}

export interface VirtualAccount {
  status: "pending" | "active" | "failed"
  account_number: string | null
  account_name: string | null
  bank_name: string | null
  failure_reason: string | null
}

export interface RequestMute {
  id: string
  user: FollowUser
  created_at: string
}

export interface DepositAccount {
  reference: string
  amount: number
  account_number: string
  account_name: string
  bank_name: string
  expires_at: string
}

export type DepositCheck = WalletOverview & {
  reference: string
  status: "pending" | "success" | "abandoned"
  amount: number
}

export interface WalletSettings {
  moneyRequestsFrom: "everyone" | "following" | "nobody"
}
