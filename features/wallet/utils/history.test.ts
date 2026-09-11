import { describe, expect, it } from "vitest"
import type { WalletTransaction } from "../types"
import {
  currentMonth,
  historyFilter,
  monthBars,
  toHistoryRows,
} from "./history"

function transaction(id: string, createdAt: string): WalletTransaction {
  return {
    id,
    type: "transfer",
    label: "To @ada",
    amount: 1000,
    direction: "out",
    balance_after: 0,
    note: null,
    created_at: createdAt,
  }
}

describe("historyFilter", () => {
  it("sends no kind for all", () => {
    expect(historyFilter("all")).toEqual({})
    expect(historyFilter("sent")).toEqual({ kind: "sent" })
  })
})

describe("currentMonth", () => {
  it("counts the month in West Africa Time", () => {
    expect(currentMonth(Date.parse("2026-08-31T23:30:00Z"))).toBe("2026-09")
    expect(currentMonth(Date.parse("2026-08-31T22:30:00Z"))).toBe("2026-08")
  })
})

describe("toHistoryRows", () => {
  it("heads each day once", () => {
    const rows = toHistoryRows([
      transaction("a", "2026-01-02T10:00:00"),
      transaction("b", "2026-01-02T09:00:00"),
      transaction("c", "2026-01-01T09:00:00"),
    ])

    expect(rows.map((row) => row.kind)).toEqual([
      "day",
      "transaction",
      "transaction",
      "day",
      "transaction",
    ])
    expect(rows[1]).toMatchObject({ id: "a" })
  })

  it("is empty for no transactions", () => {
    expect(toHistoryRows([])).toEqual([])
  })
})

describe("monthBars", () => {
  it("is nothing for a still month", () => {
    expect(monthBars(null)).toBeNull()
    expect(
      monthBars({ month: "2026-01", in: 0, out: 0, by_type: {} })
    ).toBeNull()
  })

  it("sizes against the bigger side, with a sliver for any movement", () => {
    const bars = monthBars({
      month: "2026-01",
      in: 100000,
      out: 1,
      by_type: {},
    })
    expect(bars?.in.width).toBe(100)
    expect(bars?.out.width).toBe(4)
  })

  it("leaves a side with no movement empty", () => {
    const bars = monthBars({ month: "2026-01", in: 500, out: 0, by_type: {} })
    expect(bars?.out.width).toBe(0)
  })
})
