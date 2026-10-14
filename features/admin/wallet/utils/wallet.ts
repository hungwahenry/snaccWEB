import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { humanize, plural } from "@/features/admin/shell/utils/format"
import type { BalanceChange } from "@/features/admin/shell/utils/money"
import { formatNumber } from "@/lib/format"
import { formatMoney, type Money } from "@/lib/money"
import type {
  AdjustWalletInput,
  DepositStatus,
  TransactionType,
  WalletDetail,
  WalletLine,
  PayoutDestination,
  WalletSummary,
} from "../types"

export const WALLET_TABS = ["entries", "deposits", "destinations"] as const
export type WalletTab = (typeof WALLET_TABS)[number]

export const WALLET_TAB_LABELS: Record<WalletTab, string> = {
  entries: "Movements",
  deposits: "Deposits",
  destinations: "Payout accounts",
}

export const FROZEN_STATES = ["frozen", "active"] as const
export type FrozenState = (typeof FROZEN_STATES)[number]

export const FROZEN_OPTIONS: Option<FrozenState>[] = [
  { value: "frozen", label: "Frozen" },
  { value: "active", label: "Active" },
]

export const FUNDED_STATES = ["funded"] as const
export type FundedState = (typeof FUNDED_STATES)[number]

export const FUNDED_OPTIONS: Option<FundedState>[] = [
  { value: "funded", label: "Holding money" },
]

export const ADJUST_REASON_MAX = 200

export const TRANSACTION_TYPES = [
  "earning",
  "earnings_claim",
  "transfer",
  "withdrawal",
  "withdrawal_reversal",
  "deposit",
  "adjustment",
  "premium",
  "ad_budget",
  "ad_refund",
  "ad_spend",
] as const satisfies readonly TransactionType[]

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  earning: "Earning",
  earnings_claim: "Earnings claimed",
  transfer: "Transfer",
  withdrawal: "Withdrawal",
  withdrawal_reversal: "Withdrawal returned",
  deposit: "Deposit",
  adjustment: "Adjustment by hand",
  premium: "Premium",
  ad_budget: "Promotion budget",
  ad_refund: "Promotion refund",
  ad_spend: "Promotion spend",
}

export const TRANSACTION_OPTIONS: Option<TransactionType>[] =
  TRANSACTION_TYPES.map((type) => ({
    value: type,
    label: TRANSACTION_LABELS[type],
  }))

export function lineAccount(account: WalletLine["account"]): string {
  if (account.kind === "system") return `${humanize(account.slug)} pool`
  return account.kind === "earnings" ? "Earnings balance" : "Wallet"
}

const POOLS: Record<string, string> = {
  earnings: "Owed as unclaimed earnings",
  payouts: "On its way to banks",
  deposits: "Paid in from banks",
  fees: "Kept as fees",
  adjustments: "Moved by hand",
  ads: "Held for running promotions",
  revenue: "Earned from Premium and promotions",
}

/** What a system pool holds, in plain words. */
export function poolNote(slug: string): string {
  return POOLS[slug] ?? "System pool"
}

export function holdersNote(users: WalletSummary["users"]): string {
  return `${plural(users.accounts, "wallet")} · ${formatNumber(users.frozen)} frozen`
}

export function walletState(frozenAt: string | null): StatusMeta {
  return frozenAt
    ? { label: "Frozen", variant: "destructive" }
    : { label: "Active", variant: "secondary" }
}

export const DEPOSIT_STATUS: Record<DepositStatus, StatusMeta> = {
  pending: { label: "Pending", variant: "secondary" },
  success: { label: "Success", variant: "secondary" },
  abandoned: { label: "Abandoned", variant: "secondary" },
}

/** The account number they can pay into, above their deposits. */
export function personalAccountLine(
  account: WalletDetail["virtual_account"]
): string | undefined {
  if (!account) return undefined

  return `Personal account ${account.account_number ?? "—"} · ${account.bank_name ?? "—"} (${account.status})`
}

export function destinationAccount(destination: PayoutDestination): string {
  const last4 = destination.account_last4
    ? ` ····${destination.account_last4}`
    : ""

  return `${destination.account_name || "—"}${last4}`
}

/** The line under the amount: what the balance becomes, or why it can't be posted. */
export function adjustHint(
  balance: Money,
  preview: BalanceChange
): string | null {
  if (preview.ok) {
    return `Their balance goes from ${formatMoney(balance)} to ${formatMoney(preview.next)}.`
  }

  return preview.message
}

/** What to post, once the amount is usable and a reason is given. */
export function toAdjustInput(
  preview: BalanceChange,
  reason: string
): AdjustWalletInput | null {
  const why = reason.trim()
  if (!preview.ok || why === "") return null

  return { delta: preview.delta, reason: why }
}
