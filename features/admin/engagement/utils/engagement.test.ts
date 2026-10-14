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
  earn_amounts: [],
  default_score_weight: 2,
  default_feed_weight: 1.5,
  is_default: true,
  enabled: true,
  position: 0,
  ...overrides,
})

describe("parseWeight", () => {
  it("reads a blank field as null", () => {
    expect(parseWeight("scoreWeight", "  ")).toEqual({ ok: true, value: null })
    expect(parseWeight("feedWeight", "")).toEqual({ ok: true, value: null })
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
})

describe("drafts", () => {
  it("starts from the saved prices, blank where there is none", () => {
    expect(draftFrom(kind("like"))).toEqual({
      scoreWeight: "2",
      feedWeight: "1.5",
    })
  })

  it("names what is wrong with each field", () => {
    const draft = { scoreWeight: "x", feedWeight: "1" }
    expect(draftErrors(draft)).toEqual({
      scoreWeight: "Use a whole number from -1,000 to 1,000.",
      feedWeight: null,
    })
    expect(isDraftReady(draft)).toBe(false)
    expect(isDraftReady(draftFrom(kind("like")))).toBe(true)
  })

  it("sends numbers, and null for a cleared field", () => {
    expect(toUpdateInput({ scoreWeight: " 3 ", feedWeight: "" })).toEqual({
      scoreWeight: 3,
      feedWeight: null,
    })
  })

  it("refuses to build an update from a bad field", () => {
    expect(() => toUpdateInput({ scoreWeight: "1.5", feedWeight: "" })).toThrow(
      "Use a whole number from -1,000 to 1,000."
    )
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
      "2 points and a feed weight of 1.5"
    )
    expect(
      shippedSummary(
        kind("tip", { default_score_weight: 1, default_feed_weight: null })
      )
    ).toBe("1 point and no feed weight")
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
