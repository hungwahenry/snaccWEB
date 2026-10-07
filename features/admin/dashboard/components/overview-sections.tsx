"use client"

import { Area, AreaChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  EmptyNote,
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { formatNumber, percent } from "@/lib/format"
import type {
  DashboardMetrics,
  DashboardSeriesPoint,
  GrowthMetrics,
  PeriodTotals,
  SeriesMetric,
} from "../types"
import { dateLabel } from "../utils/charts"
import { funnelSteps, periodLabel } from "../utils/dashboard"

export function HeadlineStats({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <Section title="All time">
      <StatGrid columns={3}>
        <Stat
          label="Users"
          value={formatNumber(metrics.users.total)}
          hint={`${formatNumber(metrics.users.verified)} verified · ${formatNumber(metrics.users.suspended)} suspended`}
        />
        <Stat
          label="Posts"
          value={formatNumber(metrics.content.snaccs)}
          hint={`${formatNumber(metrics.content.comments)} comments · ${formatNumber(metrics.content.resnaccs)} resnaccs`}
        />
        <Stat label="Likes" value={formatNumber(metrics.engagement.likes)} />
        <Stat label="Views" value={formatNumber(metrics.engagement.views)} />
        <Stat
          label="Campuses"
          value={formatNumber(metrics.campuses.total)}
          hint={`${formatNumber(metrics.campuses.funded)} funded`}
        />
        <Stat
          label="Open reports"
          value={formatNumber(metrics.moderation.open_reports)}
          hint={`${formatNumber(metrics.moderation.reports_7d)} in last 7 days`}
        />
      </StatGrid>
    </Section>
  )
}

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

export function GrowthSection({
  days,
  growth,
}: {
  days: number
  growth: GrowthMetrics
}) {
  return (
    <Section
      title="New people"
      description={`What the people who signed up in the last ${days} days went on to do.`}
    >
      {growth.signed_up === 0 ? (
        <EmptyNote>Nobody signed up in this period.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          {funnelSteps(growth).map((step) => (
            <div key={step.key} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-muted-foreground">{step.label}</span>
                <span className="tabular-nums">
                  <span className="font-medium">
                    {formatNumber(step.count)}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {percent(step.fraction)}
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-muted">
                <div
                  className="h-full rounded bg-resnacc"
                  style={{ width: percent(step.fraction) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
