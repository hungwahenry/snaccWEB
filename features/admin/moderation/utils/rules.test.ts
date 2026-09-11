import { describe, expect, it } from "vitest"
import type { CategoryUsage, ModerationRule } from "../types"
import {
  categoryOptions,
  draftFrom,
  isDraftReady,
  parseThreshold,
  rulesOn,
  toRuleInput,
} from "./rules"

const rule = (overrides: Partial<ModerationRule> = {}): ModerationRule => ({
  id: "r1",
  surface: "comment",
  category: "harassment",
  threshold: 0.7,
  action: "hold",
  note: "Measured on a week of replies",
  position: 0,
  retired: false,
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
  ...overrides,
})

describe("rule drafts", () => {
  it("starts a new rule as a flag at 0.85 on the surface being looked at", () => {
    expect(draftFrom()).toEqual({
      surface: "snacc",
      category: "",
      threshold: "0.85",
      action: "flag",
      note: "",
    })
    expect(draftFrom(undefined, "moment").surface).toBe("moment")
  })

  it("fills in an existing rule", () => {
    expect(draftFrom(rule(), "snacc")).toEqual({
      surface: "comment",
      category: "harassment",
      threshold: "0.7",
      action: "hold",
      note: "Measured on a week of replies",
    })
  })

  it("needs a category and a score from 0 to 1", () => {
    const draft = draftFrom(rule())
    expect(isDraftReady(draft)).toBe(true)
    expect(isDraftReady({ ...draft, category: " " })).toBe(false)
    expect(isDraftReady({ ...draft, threshold: "1.2" })).toBe(false)
    expect(isDraftReady({ ...draft, threshold: "" })).toBe(false)
  })

  it("trims what was typed and drops a blank note", () => {
    expect(
      toRuleInput({
        ...draftFrom(rule()),
        category: " sexual ",
        threshold: " 0.9 ",
        note: "  ",
      })
    ).toEqual({
      surface: "comment",
      category: "sexual",
      threshold: 0.9,
      action: "hold",
      note: undefined,
    })
  })
})

describe("parseThreshold", () => {
  it("takes 0 to 1 and refuses anything else", () => {
    expect(parseThreshold("0")).toBe(0)
    expect(parseThreshold("1")).toBe(1)
    expect(parseThreshold(".5")).toBe(0.5)
    expect(parseThreshold("-0.1")).toBeNull()
    expect(parseThreshold("high")).toBeNull()
    expect(parseThreshold("  ")).toBeNull()
  })
})

describe("rulesOn", () => {
  it("keeps every rule without a surface, or only that surface's", () => {
    const rules = [rule(), rule({ id: "r2", surface: "snacc" })]
    expect(rulesOn(rules, null)).toHaveLength(2)
    expect(rulesOn(rules, "snacc").map((each) => each.id)).toEqual(["r2"])
  })
})

describe("categoryOptions", () => {
  it("offers categories by their label", () => {
    const category = {
      category: "self-harm",
      label: "Self-harm",
    } as CategoryUsage
    expect(categoryOptions([category])).toEqual([
      { value: "self-harm", label: "Self-harm" },
    ])
  })
})
