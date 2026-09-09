import { hourLabel, shortDay, utcHourToLocal } from "@/lib/format"
import type { Bar } from "../components/bar-chart"
import type { InsightsDay, InsightsHour } from "../types"

export function dailyBars(
  series: InsightsDay[],
  of: (day: InsightsDay) => number
): Bar[] {
  return series.map((day, index) => ({
    key: day.day,
    value: of(day),
    label:
      index === 0 || index === series.length - 1
        ? shortDay(day.day)
        : undefined,
  }))
}

export function hourlyBars(hours: InsightsHour[]): Bar[] {
  const local = new Array<number>(24).fill(0)
  for (const hour of hours) local[utcHourToLocal(hour.hour)] += hour.views

  return local.map((views, hour) => ({
    key: String(hour),
    value: views,
    label: hour % 6 === 0 ? hourLabel(hour) : undefined,
  }))
}

export function busiestHour(hours: InsightsHour[]): string {
  const bars = hourlyBars(hours)
  const peak = bars.reduce(
    (top, bar) => (bar.value > top.value ? bar : top),
    bars[0]
  )
  if (!peak || peak.value === 0) return "Not enough reads yet to tell"

  return `Busiest around ${hourLabel(Number(peak.key))}`
}
