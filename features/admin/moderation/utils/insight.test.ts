import { describe, expect, it } from "vitest"
import type { CategoryInsight } from "../types"
import { catches, insightBars } from "./insight"

const insight: CategoryInsight = {
  category: "harassment",
  surface: "comment",
  scans: 30,
  buckets: [
    { from: 0, count: 20 },
    { from: 0.5, count: 5 },
    { from: 0.9, count: 10 },
  ],
  would_catch: [
    { threshold: 0.5, count: 15 },
    { threshold: 0.95, count: 0 },
  ],
}

describe("insightBars", () => {
  it("sizes each bar against the tallest and lights the ones the rule fires on", () => {
    expect(insightBars(insight, 0.9)).toEqual([
      { from: 0, label: "0.0–0.1", count: 20, fraction: 1, catching: false },
      {
        from: 0.5,
        label: "0.5–0.6",
        count: 5,
        fraction: 0.25,
        catching: false,
      },
      { from: 0.9, label: "0.9–1.0", count: 10, fraction: 0.5, catching: true },
    ])
  })

  it("lights nothing without a rule and never divides by zero", () => {
    const empty = { ...insight, buckets: [{ from: 0, count: 0 }] }
    expect(insightBars(empty, null)).toEqual([
      { from: 0, label: "0.0–0.1", count: 0, fraction: 0, catching: false },
    ])
  })
})

describe("catches", () => {
  it("leaves out lines that would catch nothing", () => {
    expect(catches(insight)).toEqual([{ threshold: 0.5, count: 15 }])
  })
})
