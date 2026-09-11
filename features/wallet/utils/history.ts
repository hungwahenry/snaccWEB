import { dayLabel } from "@/lib/format"
import { HOUR_MS } from "@/lib/duration"
import type {
  HistoryChip,
  HistoryFilter,
  WalletMonthSummary,
  WalletTransaction,
} from "../types"

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

/** The server counts months in West Africa Time (UTC+1, no daylight saving). */
export function currentMonth(now = Date.now()): string {
  const wat = new Date(now + HOUR_MS)
  return `${wat.getUTCFullYear()}-${String(wat.getUTCMonth() + 1).padStart(2, "0")}`
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
  amount: number
  /** Bar width in percent. Any movement at all gets a sliver so it never reads as none. */
  width: number
}

export function monthBars(
  summary: WalletMonthSummary | null | undefined
): { in: MonthBar; out: MonthBar } | null {
  if (!summary || (summary.in === 0 && summary.out === 0)) return null

  const most = Math.max(summary.in, summary.out)
  const bar = (amount: number): MonthBar => ({
    amount,
    width: amount > 0 ? Math.max(4, (amount / most) * 100) : 0,
  })
  return { in: bar(summary.in), out: bar(summary.out) }
}
