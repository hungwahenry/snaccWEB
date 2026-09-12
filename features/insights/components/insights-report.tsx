import { Eyebrow } from "@/components/ui/eyebrow"
import { compactCount } from "@/lib/format"
import type { InsightsSummary } from "../types"
import { busiestHour, dailyBars, hourlyBars } from "../utils/charts"
import { INSIGHT_PANELS, INSIGHT_STATS } from "../utils/sections"
import { BarChart } from "./bar-chart"
import { ChartPanel, StatCard } from "./insight-cards"
import { TopSnacc } from "./top-snacc"

export function InsightsReport({ summary }: { summary: InsightsSummary }) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {INSIGHT_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value(summary)}
          />
        ))}
      </div>

      <ChartPanel
        label={INSIGHT_PANELS.views}
        caption={`${compactCount(summary.views)} in this stretch`}
      >
        <BarChart bars={dailyBars(summary.series, (day) => day.views)} />
      </ChartPanel>

      <ChartPanel
        label={INSIGHT_PANELS.followers}
        caption={`${compactCount(summary.followers_gained)} gained in this stretch`}
      >
        <BarChart
          bars={dailyBars(summary.series, (day) => day.followers)}
          accent
        />
      </ChartPanel>

      <ChartPanel
        label={INSIGHT_PANELS.hours}
        caption={busiestHour(summary.hours)}
      >
        <BarChart bars={hourlyBars(summary.hours)} />
      </ChartPanel>

      {summary.top.length > 0 ? (
        <div className="flex flex-col gap-3">
          <Eyebrow>Your best snaccs</Eyebrow>
          <p className="-mt-1 text-[13px] leading-[18px] text-pretty text-muted-foreground">
            Ranked by how many of the people who saw one acted on it, not by how
            many saw it.
          </p>

          <div className="flex flex-col gap-2">
            {summary.top.map((snacc, place) => (
              <TopSnacc key={snacc.snacc_id} snacc={snacc} place={place + 1} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
