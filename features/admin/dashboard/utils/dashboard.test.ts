import { describe, expect, it } from "vitest"
import { trendTotals } from "./dashboard"

describe("trendTotals", () => {
  it("adds up signups and snaccs, and takes the last day's active count", () => {
    expect(
      trendTotals([
        { date: "2026-09-01", signups: 2, snaccs: 10, active: 30 },
        { date: "2026-09-02", signups: 3, snaccs: 5, active: 12 },
      ])
    ).toEqual({ signups: 5, snaccs: 15, activeToday: 12 })
  })

  it("is all zeros with no days", () => {
    expect(trendTotals([])).toEqual({ signups: 0, snaccs: 0, activeToday: 0 })
  })
})
