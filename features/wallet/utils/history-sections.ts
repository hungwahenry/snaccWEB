import { dayLabel } from "@/lib/format"
import type { WalletTransaction } from "../types"

export type HistoryRow =
  | { kind: "day"; id: string; label: string }
  | { kind: "transaction"; id: string; transaction: WalletTransaction }

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
