"use client"

import { useState } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { PremiumGate } from "@/features/premium/components/premium-gate"
import { useBack } from "@/hooks/use-back"
import { InsightsReport } from "../components/insights-report"
import { InsightsSkeleton } from "../components/insights-skeleton"
import { RangePicker } from "../components/range-picker"
import { useInsights } from "../hooks/use-insights"
import { DEFAULT_RANGE } from "../routes"
import { INSIGHTS_PITCH } from "../utils/sections"

export function InsightsScreen() {
  const back = useBack()
  const [days, setDays] = useState<number>(DEFAULT_RANGE)
  const insights = useInsights(days)

  return (
    <>
      <BackHeader
        title="Insights"
        onBack={back}
        right={<RangePicker days={days} onChange={setDays} />}
      />

      <PremiumGate title={INSIGHTS_PITCH.title} body={INSIGHTS_PITCH.body}>
        <div className="flex flex-col gap-7 p-5 pb-10">
          {insights.isPending ? (
            <InsightsSkeleton />
          ) : insights.error || !insights.data ? (
            <LoadFailed
              title="Could not load your insights"
              onRetry={() => void insights.refetch()}
            />
          ) : insights.data.snaccs === 0 ? (
            <EmptyState
              title="Nothing to measure yet"
              description="Post something and the numbers will show up here."
            />
          ) : (
            <InsightsReport summary={insights.data} />
          )}
        </div>
      </PremiumGate>
    </>
  )
}
