import { describe, expect, it } from "vitest"
import type { AdminTier } from "../types"
import {
  draftFrom,
  hasFloor,
  ICON_OPTIONS,
  isDraftReady,
  isKnownIcon,
  MIN_SCORE_INVALID,
  parseMinScore,
  parsePosition,
  POSITION_INVALID,
  sortTiers,
  thresholdLabel,
  toInput,
} from "./tier"

const tier = (
  id: string,
  minScore: number,
  position = 0,
  overrides: Partial<AdminTier> = {}
): AdminTier => ({
  id,
  key: id,
  min_score: minScore,
  position,
  label: "",
  icon: "",
  color: "",
  created_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
})

const ready = {
  key: "voice",
  minScore: "500",
  position: "2",
  label: "Voice",
  icon: "medal",
  color: "#38BDF8",
}

describe("numbers", () => {
  it("takes a score of 0 or more and nothing else", () => {
    expect(parseMinScore("0")).toBe(0)
    expect(parseMinScore("12000")).toBe(12000)
    expect(parseMinScore("-5")).toBeNull()
    expect(parseMinScore("1.5")).toBeNull()
    expect(parseMinScore("")).toBeNull()
  })

  it("takes a position from 0 to 1000", () => {
    expect(parsePosition("1000")).toBe(1000)
    expect(parsePosition("1001")).toBeNull()
  })
})

describe("icons", () => {
  it("allows none or a known icon, in any case", () => {
    expect(isKnownIcon("")).toBe(true)
    expect(isKnownIcon("medal")).toBe(true)
    expect(isKnownIcon(" Medal ")).toBe(true)
    expect(isKnownIcon("diamond")).toBe(false)
  })

  it("offers every known icon by a readable name", () => {
    expect(ICON_OPTIONS).toContainEqual({
      value: "trending-up",
      label: "Trending up",
    })
  })
})

describe("drafts", () => {
  it("starts a new tier at 0 with no icon", () => {
    expect(draftFrom()).toEqual({
      key: "",
      minScore: "0",
      position: "0",
      label: "",
      icon: "",
      color: "",
    })
  })

  it("fills from an existing tier", () => {
    expect(
      draftFrom(tier("voice", 500, 2, { label: "Voice", icon: "mic" }))
    ).toMatchObject({
      key: "voice",
      minScore: "500",
      position: "2",
      icon: "mic",
    })
  })

  it("needs a key, a whole score and position, and a known icon", () => {
    expect(isDraftReady(ready)).toBe(true)
    expect(isDraftReady({ ...ready, icon: "" })).toBe(true)
    expect(isDraftReady({ ...ready, key: " " })).toBe(false)
    expect(isDraftReady({ ...ready, minScore: "lots" })).toBe(false)
    expect(isDraftReady({ ...ready, position: "-1" })).toBe(false)
    expect(isDraftReady({ ...ready, icon: "diamond" })).toBe(false)
  })

  it("holds the text limits", () => {
    expect(isDraftReady({ ...ready, key: "x".repeat(31) })).toBe(false)
    expect(isDraftReady({ ...ready, label: "x".repeat(41) })).toBe(false)
    expect(isDraftReady({ ...ready, color: "x".repeat(25) })).toBe(false)
  })
})

describe("toInput", () => {
  it("trims, lowercases the icon and sends blanks so they clear", () => {
    expect(
      toInput({ ...ready, key: " voice ", icon: " Medal ", label: " " })
    ).toEqual({
      key: "voice",
      minScore: 500,
      position: 2,
      label: "",
      icon: "medal",
      color: "#38BDF8",
    })
  })

  it("refuses typos in the numbers instead of saving 0", () => {
    expect(() => toInput({ ...ready, minScore: "5oo" })).toThrow(
      MIN_SCORE_INVALID
    )
    expect(() => toInput({ ...ready, position: "x" })).toThrow(POSITION_INVALID)
  })
})

describe("the ladder", () => {
  it("runs from the lowest score up, position breaking ties", () => {
    const sorted = sortTiers([
      tier("c", 900, 0),
      tier("b", 100, 5),
      tier("a", 100, 1),
      tier("floor", 0, 9),
    ])
    expect(sorted.map((row) => row.id)).toEqual(["floor", "a", "b", "c"])
  })

  it("does not reorder the list it was given", () => {
    const tiers = [tier("b", 100), tier("a", 0)]
    sortTiers(tiers)
    expect(tiers[0].id).toBe("b")
  })

  it("calls 0 the floor", () => {
    expect(thresholdLabel(0)).toBe("Floor")
    expect(thresholdLabel(500)).toMatch(/^500 points$/)
  })

  it("knows when nothing starts at 0", () => {
    expect(hasFloor([tier("a", 0), tier("b", 50)])).toBe(true)
    expect(hasFloor([tier("b", 50)])).toBe(false)
  })
})
