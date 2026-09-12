"use client"

import { InsightsSkeleton } from "@/features/insights/components/insights-skeleton"
import { RangePicker } from "@/features/insights/components/range-picker"
import { DEFAULT_RANGE } from "@/features/insights/routes"
import { INSIGHTS_PITCH } from "@/features/insights/utils/sections"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { PremiumGate } from "@/features/premium/components/premium-gate"

const ignore = () => {}

export default function Loading() {
  return (
    <>
      <RouteBackHeader
        title="Insights"
        right={<RangePicker days={DEFAULT_RANGE} onChange={ignore} />}
      />
      <PremiumGate title={INSIGHTS_PITCH.title} body={INSIGHTS_PITCH.body}>
        <div className="flex flex-col gap-7 p-5 pb-10">
          <InsightsSkeleton />
        </div>
      </PremiumGate>
    </>
  )
}
