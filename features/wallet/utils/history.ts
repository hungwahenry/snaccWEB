import { dayLabel } from "@/lib/format"
import type {
  HistoryChip,
  HistoryFilter,
  WalletMonthSummary,
  WalletTransaction,
} from "../types"
import type { Money } from "@/lib/money"

export const HISTORY_CHIPS: { value: HistoryChip; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sent", label: "Sent" },
  { value: "received", label: "Received" },
  { value: "topups", label: "Top-ups" },
  { value: "bank", label: "Bank" },
]

export function historyFilter(chip: HistoryChip): HistoryFilter {
  return chip === "all" ? {} : { kind: chip }
}

export function currentMonth(now = Date.now()): string {
  const date = new Date(now)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export type HistoryRow =
  | { kind: "day"; id: string; label: string }
  | { kind: "transaction"; id: string; transaction: WalletTransaction }

/** Transactions with a heading wherever the day changes. */
export function toHistoryRows(transactions: WalletTransaction[]): HistoryRow[] {
  const rows: HistoryRow[] = []
  let openDay: string | null = null

  for (const transaction of transactions) {
    const label = dayLabel(transaction.created_at)
    if (label !== openDay) {
      openDay = label
      rows.push({ kind: "day", id: `day:${label}`, label })
    }
    rows.push({ kind: "transaction", id: transaction.id, transaction })
  }

  return rows
}

export interface MonthBar {
  amount: Money
  /** Bar width in percent. Any movement at all gets a sliver so it never reads as none. */
  width: number
}

export function monthBars(
  summary: WalletMonthSummary | null | undefined
): { in: MonthBar; out: MonthBar } | null {
  if (!summary || (summary.in.amount === 0 && summary.out.amount === 0))
    return null

  const most = Math.max(summary.in.amount, summary.out.amount)
  const bar = (amount: Money): MonthBar => ({
    amount,
    width: amount.amount > 0 ? Math.max(4, (amount.amount / most) * 100) : 0,
  })
  return { in: bar(summary.in), out: bar(summary.out) }
}
