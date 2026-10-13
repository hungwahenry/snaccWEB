import { describe, expect, it } from "vitest"
import type { AdminEngagementKind } from "../types"
import {
  draftErrors,
  draftFrom,
  groupBySource,
  isDraftReady,
  parseWeight,
  shippedSummary,
  toUpdateInput,
  weightLabel,
} from "./engagement"

const kind = (
  key: string,
  overrides: Partial<AdminEngagementKind> = {}
): AdminEngagementKind => ({
  key,
  label: key,
  description: "",
  source: "server",
  score_weight: 2,
  feed_weight: 1.5,
  earn_amount: null,
  default_score_weight: 2,
  default_feed_weight: 1.5,
  default_earn_amount: null,
  is_default: true,
  enabled: true,
  position: 0,
  ...overrides,
})

describe("parseWeight", () => {
  it("reads a blank field as null", () => {
    expect(parseWeight("scoreWeight", "  ")).toEqual({ ok: true, value: null })
    expect(parseWeight("feedWeight", "")).toEqual({ ok: true, value: null })
    expect(parseWeight("earnAmount", "")).toEqual({ ok: true, value: null })
  })

  it("holds score points to whole numbers from -1000 to 1000", () => {
    expect(parseWeight("scoreWeight", "-1000")).toEqual({
      ok: true,
      value: -1000,
    })
    expect(parseWeight("scoreWeight", "1000")).toEqual({
      ok: true,
      value: 1000,
    })
    expect(parseWeight("scoreWeight", "1001").ok).toBe(false)
    expect(parseWeight("scoreWeight", "1.5").ok).toBe(false)
    expect(parseWeight("scoreWeight", "ten").ok).toBe(false)
  })

  it("allows the feed weight two decimals within range", () => {
    expect(parseWeight("feedWeight", "-0.25")).toEqual({
      ok: true,
      value: -0.25,
    })
    expect(parseWeight("feedWeight", "9999.99")).toEqual({
      ok: true,
      value: 9999.99,
    })
    expect(parseWeight("feedWeight", ".5")).toEqual({ ok: true, value: 0.5 })
    expect(parseWeight("feedWeight", "1.234").ok).toBe(false)
    expect(parseWeight("feedWeight", "10000").ok).toBe(false)
    expect(parseWeight("feedWeight", "1e2").ok).toBe(false)
  })

  it("holds earnings to whole numbers from 0 to a million", () => {
    expect(parseWeight("earnAmount", "1000000")).toEqual({
      ok: true,
      value: 1_000_000,
    })
    expect(parseWeight("earnAmount", "-1")).toEqual({
      ok: false,
      message:
        "Use a whole number from 0 to 1,000,000, in the smallest unit of the currency.",
    })
    expect(parseWeight("earnAmount", "0.5").ok).toBe(false)
  })
})

describe("drafts", () => {
  it("starts from the saved prices, blank where there is none", () => {
    expect(draftFrom(kind("like"))).toEqual({
      scoreWeight: "2",
      feedWeight: "1.5",
      earnAmount: "",
    })
  })

  it("names what is wrong with each field", () => {
    const draft = { scoreWeight: "x", feedWeight: "1", earnAmount: "-5" }
    expect(draftErrors(draft)).toEqual({
      scoreWeight: "Use a whole number from -1,000 to 1,000.",
      feedWeight: null,
      earnAmount:
        "Use a whole number from 0 to 1,000,000, in the smallest unit of the currency.",
    })
    expect(isDraftReady(draft)).toBe(false)
    expect(isDraftReady(draftFrom(kind("like")))).toBe(true)
  })

  it("sends numbers, and null for a cleared field", () => {
    expect(
      toUpdateInput({ scoreWeight: " 3 ", feedWeight: "", earnAmount: "50" })
    ).toEqual({ scoreWeight: 3, feedWeight: null, earnAmount: 50 })
  })

  it("refuses to build an update from a bad field", () => {
    expect(() =>
      toUpdateInput({ scoreWeight: "1.5", feedWeight: "", earnAmount: "" })
    ).toThrow("Use a whole number from -1,000 to 1,000.")
  })
})

describe("weightLabel", () => {
  it("shows a dash for nothing", () => {
    expect(weightLabel(null)).toBe("—")
    expect(weightLabel(0)).toBe("0")
    expect(weightLabel(1.25)).toBe("1.25")
  })
})

describe("shippedSummary", () => {
  it("says the shipped prices in words", () => {
    expect(shippedSummary(kind("like"))).toBe(
      "2 points, a feed weight of 1.5 and no earnings"
    )
    expect(
      shippedSummary(
        kind("tip", {
          default_score_weight: 1,
          default_feed_weight: null,
          default_earn_amount: 50,
        })
      )
    ).toBe("1 point, no feed weight and 50 in earnings")
  })
})

describe("groupBySource", () => {
  it("puts Snacc's own records first and drops an empty side", () => {
    const groups = groupBySource([
      kind("view", { source: "client" }),
      kind("like"),
    ])
    expect(groups.map((group) => group.source)).toEqual(["server", "client"])
    expect(groups[0].title).toBe("Recorded by Snacc")
    expect(groupBySource([kind("like")]).map((group) => group.source)).toEqual([
      "server",
    ])
  })
})
