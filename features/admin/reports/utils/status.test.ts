import { describe, expect, it } from "vitest"
import {
  countOpen,
  OUTCOME_OPTIONS,
  REPORT_STATUS,
  STATUS_FILTERS,
  STATUS_OPTIONS,
  statusQuery,
  TARGET_OPTIONS,
  TARGET_TYPES,
} from "./status"

describe("status filter", () => {
  it("offers every status first, then each one", () => {
    expect(STATUS_OPTIONS.map((option) => option.label)).toEqual([
      "All status",
      "Open",
      "Actioned",
      "Dismissed",
    ])
    expect(STATUS_FILTERS).toContain("all")
  })

  it("sends no status when every status is wanted", () => {
    expect(statusQuery("all")).toBeUndefined()
    expect(statusQuery("open")).toBe("open")
  })
})

describe("options", () => {
  it("resolves only as actioned or dismissed", () => {
    expect(OUTCOME_OPTIONS.map((option) => option.value)).toEqual([
      "actioned",
      "dismissed",
    ])
  })

  it("names every target, room messages included", () => {
    expect(TARGET_OPTIONS.map((option) => option.value)).toEqual([
      ...TARGET_TYPES,
    ])
    expect(TARGET_OPTIONS.at(-1)).toEqual({
      value: "chat_message",
      label: "Room messages",
    })
  })

  it("gives each status a badge", () => {
    expect(REPORT_STATUS.open).toEqual({ label: "Open", variant: "secondary" })
  })
})

describe("countOpen", () => {
  it("counts only the open filings", () => {
    expect(
      countOpen([
        { status: "open" },
        { status: "dismissed" },
        { status: "open" },
      ])
    ).toBe(2)
    expect(countOpen([])).toBe(0)
  })
})
