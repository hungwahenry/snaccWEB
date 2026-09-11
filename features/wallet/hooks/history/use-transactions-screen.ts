"use client"

import { useMemo, useState } from "react"
import type { HistoryChip } from "../../types"
import {
  currentMonth,
  historyFilter,
  monthBars,
  toHistoryRows,
} from "../../utils/history"
import { useSummary } from "./use-summary"
import { useTransactionSheet } from "./use-transaction-sheet"
import { useWalletTransactions } from "./use-wallet-transactions"

export function useTransactionsScreen() {
  const [chip, setChip] = useState<HistoryChip>("all")
  const transactions = useWalletTransactions(historyFilter(chip))
  const summary = useSummary(currentMonth())
  const { open, sheet } = useTransactionSheet()

  // The previous chip's rows would read as this chip's until its first page lands.
  const hidden = transactions.stale
  const rows = useMemo(
    () => (hidden ? [] : toHistoryRows(transactions.items)),
    [hidden, transactions.items]
  )

  return {
    chip,
    setChip,
    bars: monthBars(summary.data),
    list: {
      rows,
      loading: transactions.loading || hidden,
      failed: transactions.failed,
      retry: transactions.retry,
      loadingMore: transactions.loadingMore,
      loadMore: transactions.loadMore,
    },
    openTransaction: open,
    sheet,
  }
}

export type TransactionsScreenProps = ReturnType<typeof useTransactionsScreen>
