import type { ChartConfig } from "@/components/ui/chart"
import { compactCount, shortDay } from "@/lib/format"
import type {
  Breakdown,
  BreakdownKey,
  BreakdownPoint,
  BreakdownTotal,
} from "../types"

export const CHART_COLORS = [
  "var(--resnacc)",
  "var(--premium)",
  "var(--chart-2)",
  "var(--destructive)",
  "var(--chart-4)",
  "var(--chart-1)",
  "var(--chart-5)",
  "var(--chart-3)",
]

export const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }

export const DATE_AXIS = {
  dataKey: "date",
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  minTickGap: 24,
  tickFormatter: shortDay,
} as const

export const COUNT_AXIS = {
  tickLine: false,
  axisLine: false,
  width: 36,
  allowDecimals: false,
  tickFormatter: compactCount,
} as const

export function dateLabel(date: unknown): string {
  return shortDay(String(date))
}

export function breakdownConfig(keys: BreakdownKey[]): ChartConfig {
  return Object.fromEntries(
    keys.map((key, index) => [
      key.key,
      { label: key.label, color: CHART_COLORS[index % CHART_COLORS.length] },
    ])
  )
}

export function breakdownTotals(breakdown: Breakdown): BreakdownTotal[] {
  return breakdown.keys.map((key) => ({
    ...key,
    total: breakdown.series.reduce(
      (sum, point) => sum + Number(point[key.key] ?? 0),
      0
    ),
  }))
}

export function inNaira(breakdown: Breakdown): Breakdown {
  return {
    keys: breakdown.keys,
    series: breakdown.series.map((point) => {
      const next: BreakdownPoint = { date: point.date }
      for (const key of breakdown.keys) {
        next[key.key] = Number(point[key.key] ?? 0) / 100
      }
      return next
    }),
  }
}
