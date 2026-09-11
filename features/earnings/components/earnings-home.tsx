import { SparklesIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { Spinner } from "@/components/ui/spinner"
import type { EarningsHomeProps } from "../hooks/use-earnings-home"
import { EarningEventRow } from "./earning-event-row"
import { EarningsSkeleton } from "./earnings-skeleton"
import { EarningsSummary } from "./earnings-summary"

export function EarningsHome({
  loading,
  retry,
  summary,
  fund,
  topSnaccs,
  events,
}: EarningsHomeProps) {
  if (loading) return <EarningsSkeleton />
  if (!summary) {
    return (
      <div className="py-24">
        <LoadFailed title="Could not load your earnings" onRetry={retry} />
      </div>
    )
  }

  return (
    <div className="pb-8">
      <EarningsSummary {...summary} fund={fund} topSnaccs={topSnaccs} />

      {events.loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : events.items.length === 0 ? (
        <EmptyState
          icon={SparklesIcon}
          title="No earnings yet"
          description="Post snaccs people love — every reaction pays."
          className="py-10"
        />
      ) : (
        events.items.map((event) => (
          <EarningEventRow key={event.id} event={event} />
        ))
      )}
      <LoadMore
        onReach={events.loadMore}
        disabled={events.loading || events.loadingMore}
      />
      <ListFooter loading={events.loadingMore} />
    </div>
  )
}
