import type { CategoryInsight, InsightBar } from "../types"

/** One bar per tenth of the score range, sized against the tallest, lit where the rule fires. */
export function insightBars(
  insight: CategoryInsight,
  threshold: number | null
): InsightBar[] {
  const peak = Math.max(1, ...insight.buckets.map((bucket) => bucket.count))

  return insight.buckets.map((bucket) => ({
    from: bucket.from,
    label: `${bucket.from.toFixed(1)}–${(bucket.from + 0.1).toFixed(1)}`,
    count: bucket.count,
    fraction: bucket.count / peak,
    catching: threshold !== null && bucket.from >= threshold,
  }))
}

/** How much each other line would have caught, leaving out the lines that catch nothing. */
export function catches(insight: CategoryInsight) {
  return insight.would_catch.filter((row) => row.count > 0)
}
