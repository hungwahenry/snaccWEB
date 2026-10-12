import { describe, expect, it } from "vitest"
import type { AdStats } from "../types"
import {
  AD_STATUS,
  adActions,
  adStatus,
  emptyNote,
  STATUS_FILTERS,
  statusQuery,
  statusTabs,
} from "./status"

const stats: AdStats = {
  by_status: [
    { status: "pending", count: 3 },
    { status: "active", count: 2 },
    { status: "ended", count: 10 },
  ],
  held_kobo: 500_000,
  earned_kobo: 120_000,
}

describe("adStatus", () => {
  const now = Date.parse("2026-10-12T12:00:00Z")

  it("names each status in plain words", () => {
    expect(AD_STATUS.pending.label).toBe("Pending")
    expect(
      adStatus({ status: "rejected", starts_at: "2026-10-01T00:00:00Z" }, now)
    ).toEqual({
      label: "Rejected",
      variant: "destructive",
    })
  })

  it("calls an approved one that has not started yet scheduled", () => {
    expect(
      adStatus({ status: "active", starts_at: "2026-10-13T00:00:00Z" }, now)
        .label
    ).toBe("Scheduled")
    expect(
      adStatus({ status: "active", starts_at: "2026-10-12T00:00:00Z" }, now)
        .label
    ).toBe("Active")
  })
})

describe("status filters", () => {
  it("opens on the review queue and keeps all for last", () => {
    expect(STATUS_FILTERS[0]).toBe("pending")
    expect(STATUS_FILTERS.at(-1)).toBe("all")
  })

  it("sends no status for all", () => {
    expect(statusQuery("all")).toBeUndefined()
    expect(statusQuery("paused")).toBe("paused")
  })
})

describe("statusTabs", () => {
  it("counts each status, zero for the missing ones, and totals all", () => {
    expect(
      statusTabs(stats).map((tab) => [tab.value, tab.label, tab.count])
    ).toEqual([
      ["pending", "Pending", 3],
      ["active", "Active", 2],
      ["paused", "Paused", 0],
      ["rejected", "Rejected", 0],
      ["ended", "Ended", 10],
      ["all", "All", 15],
    ])
  })

  it("leaves the counts out until the numbers load", () => {
    expect(statusTabs(undefined).every((tab) => tab.count === null)).toBe(true)
  })
})

describe("adActions", () => {
  it("offers only what each status allows", () => {
    expect(adActions("pending")).toEqual(["approve", "reject"])
    expect(adActions("active")).toEqual(["pause", "end"])
    expect(adActions("paused")).toEqual(["resume", "end"])
    expect(adActions("rejected")).toEqual([])
    expect(adActions("ended")).toEqual([])
  })
})

describe("emptyNote", () => {
  it("says why the list is empty", () => {
    expect(emptyNote("pending", false)).toBe("Nothing is waiting for review.")
    expect(emptyNote("all", false)).toBe("Nobody has paid for a promotion yet.")
    expect(emptyNote("paused", false)).toBe("No paused promotions.")
    expect(emptyNote("pending", true)).toBe(
      "No promotions from anyone matching that."
    )
  })
})
