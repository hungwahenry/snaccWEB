import { describe, expect, it } from "vitest"
import { shortDay } from "@/lib/format"
import type { Breakdown } from "../types"
import {
  breakdownConfig,
  breakdownTotals,
  CHART_COLORS,
  dateLabel,
  inNaira,
} from "./charts"

const BREAKDOWN: Breakdown = {
  keys: [
    { key: "deposit", label: "Deposits" },
    { key: "transfer", label: "Transfers" },
  ],
  series: [
    { date: "2026-09-28", deposit: 5000, transfer: 250 },
    { date: "2026-09-29", deposit: 1000, transfer: 0 },
  ],
}

describe("breakdownConfig", () => {
  it("gives every kind its label and the next colour in turn", () => {
    expect(breakdownConfig(BREAKDOWN.keys)).toEqual({
      deposit: { label: "Deposits", color: CHART_COLORS[0] },
      transfer: { label: "Transfers", color: CHART_COLORS[1] },
    })
  })
})

describe("breakdownTotals", () => {
  it("adds each kind up across the days", () => {
    expect(breakdownTotals(BREAKDOWN)).toEqual([
      { key: "deposit", label: "Deposits", total: 6000 },
      { key: "transfer", label: "Transfers", total: 250 },
    ])
  })
})

describe("inNaira", () => {
  it("turns kobo into naira and keeps the days", () => {
    expect(inNaira(BREAKDOWN).series).toEqual([
      { date: "2026-09-28", deposit: 50, transfer: 2.5 },
      { date: "2026-09-29", deposit: 10, transfer: 0 },
    ])
  })
})

describe("dateLabel", () => {
  it("reads a chart's day the way the rest of the panel does", () => {
    expect(dateLabel("2026-09-29")).toBe(shortDay("2026-09-29"))
  })
})
