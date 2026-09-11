import type { DashboardSeriesPoint } from "../types"

/** What the trend cards headline: signups and snaccs across the whole series, and today's active count. */
export function trendTotals(series: DashboardSeriesPoint[]) {
  return {
    signups: series.reduce((total, point) => total + point.signups, 0),
    snaccs: series.reduce((total, point) => total + point.snaccs, 0),
    activeToday: series.at(-1)?.active ?? 0,
  }
}
