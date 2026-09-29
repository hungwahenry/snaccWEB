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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatNaira, formatNumber } from "@/lib/format"
import type { Breakdown } from "../types"
import {
  breakdownConfig,
  breakdownTotals,
  CHART_COLORS,
  CHART_MARGIN,
  COUNT_AXIS,
  DATE_AXIS,
  dateLabel,
  inNaira,
} from "../utils/charts"

function Totals({
  breakdown,
  money,
}: {
  breakdown: Breakdown
  money: boolean
}) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
      {breakdownTotals(breakdown).map((row, index) => (
        <li key={row.key} className="flex items-center gap-1.5">
          <span
            className="size-2.5 shrink-0 rounded-sm"
            style={{
              backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
            }}
          />
          <span className="text-muted-foreground">{row.label}</span>
          <span className="font-medium tabular-nums">
            {money ? formatNaira(row.total) : formatNumber(row.total)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function BreakdownChart({
  breakdown,
  variant = "bars",
  money = false,
}: {
  breakdown: Breakdown
  variant?: "bars" | "lines"
  money?: boolean
}) {
  if (breakdown.keys.length === 0) {
    return (
      <p className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Nothing in this period.
      </p>
    )
  }

  const data = money ? inNaira(breakdown).series : breakdown.series
  const last = breakdown.keys.length - 1

  return (
    <div className="flex flex-col gap-3">
      <ChartContainer
        config={breakdownConfig(breakdown.keys)}
        className="h-64 w-full"
      >
        {variant === "bars" ? (
          <BarChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid vertical={false} />
            <XAxis {...DATE_AXIS} />
            <YAxis {...COUNT_AXIS} />
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={dateLabel} />}
            />
            {breakdown.keys.map((key, index) => (
              <Bar
                key={key.key}
                dataKey={key.key}
                stackId="day"
                fill={`var(--color-${key.key})`}
                radius={index === last ? [3, 3, 0, 0] : 0}
              />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid vertical={false} />
            <XAxis {...DATE_AXIS} />
            <YAxis {...COUNT_AXIS} />
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={dateLabel} />}
            />
            {breakdown.keys.map((key) => (
              <Line
                key={key.key}
                dataKey={key.key}
                type="monotone"
                stroke={`var(--color-${key.key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        )}
      </ChartContainer>
      <Totals breakdown={breakdown} money={money} />
    </div>
  )
}
