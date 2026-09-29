"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { formatNumber, percent } from "@/lib/format"
import type { AudienceMetrics, AudiencePoint } from "../types"
import { CHART_MARGIN, COUNT_AXIS, DATE_AXIS, dateLabel } from "../utils/charts"
import { ChartFrame } from "./chart-frame"

const ACTIVE_CONFIG = {
  dau: { label: "Daily", color: "var(--resnacc)" },
  wau: { label: "Weekly", color: "var(--premium)" },
  mau: { label: "Monthly", color: "var(--chart-2)" },
} satisfies ChartConfig

const RETURNING_CONFIG = {
  returning: { label: "Returning", color: "var(--resnacc)" },
  new_users: { label: "New", color: "var(--premium)" },
} satisfies ChartConfig

function ActiveChart({ series }: { series: AudiencePoint[] }) {
  return (
    <ChartContainer config={ACTIVE_CONFIG} className="h-64 w-full">
      <LineChart data={series} margin={CHART_MARGIN}>
        <CartesianGrid vertical={false} />
        <XAxis {...DATE_AXIS} />
        <YAxis {...COUNT_AXIS} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={dateLabel} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {(["mau", "wau", "dau"] as const).map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

function ReturningChart({ series }: { series: AudiencePoint[] }) {
  return (
    <ChartContainer config={RETURNING_CONFIG} className="h-64 w-full">
      <BarChart data={series} margin={CHART_MARGIN}>
        <CartesianGrid vertical={false} />
        <XAxis {...DATE_AXIS} />
        <YAxis {...COUNT_AXIS} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={dateLabel} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="returning"
          stackId="active"
          fill="var(--color-returning)"
        />
        <Bar
          dataKey="new_users"
          stackId="active"
          fill="var(--color-new_users)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

export function AudienceSection({ audience }: { audience: AudienceMetrics }) {
  const { summary, series } = audience

  return (
    <Section
      title="Audience"
      description="Anyone who viewed, posted, reacted, shared or sent a message, counted per Lagos day."
    >
      <StatGrid columns={4}>
        <Stat
          label="Active yesterday"
          value={formatNumber(summary.active_yesterday)}
        />
        <Stat
          label="Active this week"
          value={formatNumber(summary.weekly)}
          hint="last 7 days"
        />
        <Stat
          label="Active this month"
          value={formatNumber(summary.monthly)}
          hint="last 30 days"
        />
        <Stat
          label="Stickiness"
          value={percent(summary.stickiness)}
          hint="of the month's people, on a typical day"
        />
      </StatGrid>
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartFrame title="Active people">
          <ActiveChart series={series} />
        </ChartFrame>
        <ChartFrame title="New and returning, per day">
          <ReturningChart series={series} />
        </ChartFrame>
      </div>
    </Section>
  )
}
