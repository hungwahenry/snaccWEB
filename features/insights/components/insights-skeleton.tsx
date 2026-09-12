import { Skeleton } from "@/components/ui/skeleton"
import { INSIGHT_PANELS, INSIGHT_STATS } from "../utils/sections"
import { ChartPanel, StatCard } from "./insight-cards"

const CHARTS = Object.values(INSIGHT_PANELS)

export function InsightsSkeleton() {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {INSIGHT_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={<Skeleton className="my-1 h-6 w-16 bg-accent" />}
          />
        ))}
      </div>

      {CHARTS.map((label) => (
        <ChartPanel
          key={label}
          label={label}
          caption={<Skeleton className="my-[3px] h-3.5 w-40" />}
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-[108px] rounded-lg bg-accent" />
            <div className="h-[15px]" />
          </div>
        </ChartPanel>
      ))}
    </>
  )
}
