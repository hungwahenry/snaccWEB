import type { EarningsMilestone } from "@/features/earnings/types"
import type { UserScore } from "@/features/score/types"
import type { MoneyRequestPrivacy } from "@/features/users/types"

/** A person on a money record, as the server's `author` shape sends them. */
export interface MoneyPerson {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string; slug: string } | null
  score: UserScore
  official: boolean
  premium: boolean
  is_birthday: boolean
}

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
    milestones: EarningsMilestone[]
  }
}

export interface WalletSettings {
  moneyRequestsFrom: MoneyRequestPrivacy
}

export type WalletTransactionType =
  | "earnings_claim"
  | "transfer"
  | "withdrawal"
  | "withdrawal_reversal"
  | "deposit"
  | "adjustment"
  | "premium"

export type MoneyDirection = "in" | "out"

export interface WalletTransaction {
  id: string
  type: WalletTransactionType
  label: string
  amount: number
  direction: MoneyDirection
  balance_after: number
  note: string | null
  created_at: string
}

export type HistoryKind = "sent" | "received" | "topups" | "bank" | "earnings"

export type HistoryChip = HistoryKind | "all"

export interface HistoryFilter {
  kind?: HistoryKind
  month?: string
}

export interface WalletMonthSummary {
  month: string
  in: number
  out: number
  by_type: Partial<Record<WalletTransactionType, number>>
}

export type LimitTier = "basic" | "verified"

export type LimitRail = "send" | "bank_send" | "deposit"

export interface RailUsage {
  limit: number
  used: number
}

export type WalletLimits = { tier: LimitTier } & Record<LimitRail, RailUsage>

export type PayoutStatus = "pending" | "success" | "failed" | "reversed"

export interface PayoutDelivery {
  status: PayoutStatus
  bank_name: string
  account_last4: string
  account_name: string
  timeline: { status: PayoutStatus; at: string }[]
}

export interface WalletTransactionDetail extends WalletTransaction {
  reference: string
  fee: number
  total: number
  status: PayoutStatus
  channel: string | null
  counterparty: MoneyPerson | null
  context:
    | { kind: "request"; note: string | null }
    | { kind: "conversation"; id: string }
    | null
  delivery: PayoutDelivery | null
}

export interface WalletRecipient {
  id: string
  kind: "user" | "bank"
  last_used_at: string
  times_used: number
  user: MoneyPerson | null
  bank: {
    bank_code: string | null
    bank_name: string | null
    account_last4: string | null
    account_name: string | null
  } | null
}

export type MoneyRequestStatus =
  "pending" | "paid" | "declined" | "cancelled" | "expired"

export type RequestBox = "incoming" | "outgoing"

export interface MoneyRequest {
  id: string
  amount: number
  note: string | null
  status: MoneyRequestStatus
  requester: MoneyPerson
  target: MoneyPerson
  expires_at: string
  created_at: string
  resolved_at: string | null
}

export interface RequestMute {
  id: string
  user: MoneyPerson
  created_at: string
}

/** How a status reads: good news, bad news, nothing to act on, or still open. */
export type MoneyTone = "good" | "bad" | "quiet" | "open"

export interface StatusLook {
  label: string
  tone: MoneyTone
}

export interface VirtualAccount {
  status: "pending" | "active" | "failed"
  account_number: string | null
  account_name: string | null
  bank_name: string | null
  failure_reason: string | null
}

export interface DepositAccount {
  reference: string
  amount: number
  account_number: string
  account_name: string
  bank_name: string
  expires_at: string
}

export interface DepositCheck extends WalletOverview {
  reference: string
  status: "pending" | "success" | "abandoned"
  amount: number
}

export interface BankAccountRef {
  bankCode: string
  accountNumber: string
}

export interface ResolvedBankAccount {
  account_name: string
}

/** What confirms a money move: the wallet PIN, or an emailed step-up for bigger amounts. */
export interface MoneyCredential {
  pin?: string
  stepUpId?: string
}

export interface MoneyMove {
  amountKobo: number
  kind: "user" | "bank"
}

export interface CreateRequestInput {
  username: string
  amountKobo: number
  note?: string
  conversationId?: string
}

export type SendToUserInput = MoneyCredential & {
  username: string
  amountKobo: number
  conversationId?: string
  note?: string
}

export type SendToBankInput = MoneyCredential & { amountKobo: number } & (
    { recipientId: string } | BankAccountRef
  )

export type PayRequestInput = MoneyCredential & { id: string }

export interface DeclineRequestInput {
  id: string
  mute?: boolean
}

export interface SetPinInput {
  pin: string
  stepUpId: string
}

export interface ActivateVirtualAccountInput {
  firstName: string
  lastName: string
  phone: string
  bvn?: string
  accountNumber?: string
  bankCode?: string
}

export type PayMode = "send" | "request" | "topup"

export type PayStep = "amount" | "recipient" | "review"

/** What a pay link carries into the pay screen. */
export interface PayPrefill {
  mode: PayMode
  to?: string
  recipientId?: string
  conversationId?: string
  amount?: string
}

/** Whoever money can go to by username: a search result, a recent, or a pay link's owner. */
export type Payee = Pick<
  MoneyPerson,
  "id" | "username" | "display_name" | "avatar_url"
>

export type SendTarget =
  | { kind: "user"; user: Payee }
  | {
      kind: "bank"
      bankName: string
      accountName: string
      accountLast4: string
      source: { recipientId: string } | BankAccountRef
    }

/** How a person or an account reads: a title, a second line, and one short line for tight spots. */
export interface PartyLabel {
  title: string
  subtitle: string | null
  short: string
}

export type PinSetupMode = "setup" | "change"

export type PinSetupStage = "intro" | "enter" | "confirm"

export type MoneySection = "home" | "transactions" | "requests" | "earnings"
