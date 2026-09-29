"use client"

import { Area, AreaChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Section } from "@/features/admin/shell/components/detail"
import { formatNumber } from "@/lib/format"
import type { DashboardSeriesPoint, PeriodTotals, SeriesMetric } from "../types"
import { dateLabel } from "../utils/charts"
import { periodLabel } from "../utils/dashboard"

function Trend({
  label,
  value,
  series,
  metric,
}: {
  label: string
  value: number
  series: DashboardSeriesPoint[]
  metric: SeriesMetric
}) {
  const config = {
    [metric]: { label, color: "var(--resnacc)" },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col gap-2 rounded-lg border px-4 py-3">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums">
          {formatNumber(value)}
        </p>
      </div>
      <ChartContainer config={config} className="h-20 w-full">
        <AreaChart
          data={series}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis dataKey="date" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent labelFormatter={dateLabel} />}
          />
          <Area
            dataKey={metric}
            type="monotone"
            stroke={`var(--color-${metric})`}
            fill={`var(--color-${metric})`}
            fillOpacity={0.12}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

export function TrendsSection({
  days,
  series,
  totals,
}: {
  days: number
  series: DashboardSeriesPoint[]
  totals: PeriodTotals
}) {
  return (
    <Section title={periodLabel(days)}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Trend
          label="Signups"
          value={totals.signups}
          series={series}
          metric="signups"
        />
        <Trend
          label="Posts"
          value={totals.posts}
          series={series}
          metric="posts"
        />
        <Trend
          label="Active people"
          value={totals.active}
          series={series}
          metric="active"
        />
      </div>
    </Section>
  )
}
