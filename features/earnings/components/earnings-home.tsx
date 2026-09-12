import { LoadFailed } from "@/components/ui/load-failed"
import type { EarningsHomeProps } from "../hooks/use-earnings-home"
import { EarningsSkeleton } from "./earnings-skeleton"
import { EarningsSummary } from "./earnings-summary"

export function EarningsHome({
  loading,
  retry,
  summary,
  fund,
  topSnaccs,
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
    </div>
  )
}
