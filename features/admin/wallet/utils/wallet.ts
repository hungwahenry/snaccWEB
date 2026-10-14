import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import type { BalanceChange } from "@/features/admin/shell/utils/money"
import { formatNumber } from "@/lib/format"
import { formatMoney, type Money } from "@/lib/money"
import type {
  AdjustWalletInput,
  DepositStatus,
  WalletDetail,
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
