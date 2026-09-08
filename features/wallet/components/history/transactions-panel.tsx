"use client"

import { ArrowLeftRightIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { Spinner } from "@/components/ui/spinner"
import { useSummary } from "../../hooks/history/use-summary"
import { useTransactionDetail } from "../../hooks/history/use-transaction-detail"
import { useReceiptShare } from "../../hooks/history/use-receipt-share"
import { useWalletTransactions } from "../../hooks/history/use-wallet-transactions"
import type { WalletTransaction } from "../../types"
import { currentMonth } from "../../utils/format"
import { toHistoryRows } from "../../utils/history-sections"
import {
  ActivityHeader,
  type HistoryFilterValue,
} from "../home/activity-header"
import { HistoryRows } from "../home/history-rows"
import { TransactionDetailSheet } from "../home/transaction-detail-sheet"

export function TransactionsPanel({
  onSendAgain,
}: {
  onSendAgain: (username: string) => void
}) {
  const [filter, setFilter] = useState<HistoryFilterValue>("all")
  const transactions = useWalletTransactions(
    filter === "all" ? {} : { kind: filter }
  )
  const summary = useSummary(currentMonth())
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const detail = useTransactionDetail(detailOpen ? detailId : null)
  const receipt = useReceiptShare()

  const rows = useMemo(
    () => toHistoryRows(transactions.items),
    [transactions.items]
  )
  const listLoading = transactions.loading || transactions.stale

  if (transactions.failed) {
    return (
      <div className="py-24">
        <LoadFailed
          title="Could not load your transactions"
          onRetry={transactions.retry}
        />
      </div>
    )
  }

  function openDetail(transaction: WalletTransaction) {
    setDetailId(transaction.id)
    setDetailOpen(true)
  }

  return (
    <>
      <div className="pt-2">
        <ActivityHeader
          filter={filter}
          onFilter={setFilter}
          summary={summary.data ?? null}
        />
      </div>

      {listLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRightIcon}
          title="Nothing here yet"
          description="Money moves matching this filter will show up here."
          className="py-10"
        />
      ) : (
        <HistoryRows rows={rows} onOpen={openDetail} />
      )}
      <LoadMore
        onReach={transactions.loadMore}
        disabled={listLoading || transactions.loadingMore}
      />
      <ListFooter loading={transactions.loadingMore} />

      <TransactionDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        detail={detail.data ?? null}
        loading={detail.isLoading}
        failed={detail.isError}
        onRetry={() => void detail.refetch()}
        receipt={receipt}
        onSendAgain={(username) => {
          setDetailOpen(false)
          onSendAgain(username)
        }}
      />
    </>
  )
}
