import { ArrowLeftRightIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { Spinner } from "@/components/ui/spinner"
import type { TransactionsScreenProps } from "../../hooks/history/use-transactions-screen"
import { HistoryRows } from "../home/history-rows"
import { TransactionDetailSheet } from "../home/transaction-detail-sheet"
import { ActivityHeader } from "./activity-header"

export function TransactionsPanel({
  chip,
  setChip,
  bars,
  list,
  openTransaction,
  sheet,
}: TransactionsScreenProps) {
  if (list.failed) {
    return (
      <div className="py-24">
        <LoadFailed
          title="Could not load your transactions"
          onRetry={list.retry}
        />
      </div>
    )
  }

  return (
    <>
      <div className="pt-2">
        <ActivityHeader chip={chip} onChip={setChip} bars={bars} />
      </div>

      {list.loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : list.rows.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRightIcon}
          title="Nothing here yet"
          description="Money moves matching this filter will show up here."
          className="py-10"
        />
      ) : (
        <HistoryRows rows={list.rows} onOpen={openTransaction} />
      )}
      <LoadMore
        onReach={list.loadMore}
        disabled={list.loading || list.loadingMore}
      />
      <ListFooter loading={list.loadingMore} />

      <TransactionDetailSheet {...sheet} />
    </>
  )
}
