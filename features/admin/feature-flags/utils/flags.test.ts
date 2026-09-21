import { describe, expect, it } from "vitest"
import type { AdminFeatureFlag, FlagDraft, FlagPlatformRule } from "../types"
import {
  audienceLabel,
  described,
  draftErrors,
  draftFrom,
  groupByCategory,
  isDraftReady,
  patchRule,
  reachLabel,
  ruleFor,
  toFlagChanges,
  windowErrors,
  windowLabel,
  withRule,
} from "./flags"

const flag = (overrides: Partial<AdminFeatureFlag> = {}): AdminFeatureFlag => ({
  key: "ghost_hour",
  enabled: true,
  category: "social",
  description: "",
  is_public: true,
  audience: "everyone",
  member_count: 0,
  min_version: null,
  max_version: null,
  overrides: [],
  updated_at: "2026-09-01T00:00:00Z",
  ...overrides,
})

const rule = (
  platform: FlagPlatformRule["platform"],
  overrides: Partial<FlagPlatformRule> = {}
): FlagPlatformRule => ({
  platform,
  enabled: true,
  min_version: null,
  max_version: null,
  ...overrides,
})

describe("windowLabel", () => {
  it("reads a window both ends, one end, or not at all", () => {
    expect(windowLabel({ min_version: "1.2.0", max_version: "1.4.0" })).toBe(
      "1.2.0 – 1.4.0"
    )
    expect(windowLabel({ min_version: "1.2.0", max_version: null })).toBe(
      "1.2.0+"
    )
    expect(windowLabel({ min_version: null, max_version: "1.4.0" })).toBe(
      "up to 1.4.0"
    )
    expect(windowLabel({ min_version: null, max_version: null })).toBeNull()
  })
})

describe("ruleFor", () => {
  it("finds a platform's own rule", () => {
    const withIos = flag({ overrides: [rule("ios")] })
    expect(ruleFor(withIos, "ios")?.platform).toBe("ios")
    expect(ruleFor(withIos, "android")).toBeUndefined()
  })
})

describe("reachLabel", () => {
  it("lets a platform's rule win over the flag's window", () => {
    const gated = flag({
      min_version: "1.2.0",
      overrides: [rule("ios", { min_version: "1.3.0" })],
    })
    expect(reachLabel(gated, "ios")).toBe("1.3.0+")
    expect(reachLabel(gated, "android")).toBe("1.2.0+")
  })

  it("says off, every visit or every build", () => {
    const flagged = flag({
      overrides: [rule("android", { enabled: false })],
    })
    expect(reachLabel(flagged, "android")).toBe("Off")
    expect(reachLabel(flagged, "web")).toBe("Every visit")
    expect(reachLabel(flagged, "ios")).toBe("Every build")
  })
})

describe("described", () => {
  it("says what the flag now does", () => {
    expect(described(flag({ enabled: false }))).toBe("ghost_hour turned off.")
    expect(described(flag({ overrides: [rule("ios")] }))).toBe(
      "ghost_hour saved, with 1 platform rule."
    )
    expect(described(flag({ overrides: [rule("ios"), rule("web")] }))).toBe(
      "ghost_hour saved, with 2 platform rules."
    )
    expect(
      described(flag({ min_version: "1.2.0", max_version: "1.4.0" }))
    ).toBe("ghost_hour on for 1.2.0 to 1.4.0.")
    expect(described(flag({ min_version: "1.2.0" }))).toBe(
      "ghost_hour on from 1.2.0 up."
    )
    expect(described(flag({ max_version: "1.4.0" }))).toBe(
      "ghost_hour on up to 1.4.0."
    )
    expect(described(flag())).toBe("ghost_hour on for every build.")
  })

  it("says who it is for when that is not everyone", () => {
    expect(described(flag({ audience: "listed", member_count: 3 }))).toBe(
      "ghost_hour on for 3 listed people."
    )
    expect(described(flag({ audience: "premium" }))).toBe(
      "ghost_hour on for premium subscribers."
    )
  })
})

describe("audienceLabel", () => {
  it("counts the list, and names everyone else plainly", () => {
    expect(audienceLabel({ audience: "everyone", member_count: 4 })).toBe(
      "Everyone"
    )
    expect(audienceLabel({ audience: "premium", member_count: 0 })).toBe(
      "Premium subscribers"
    )
    expect(audienceLabel({ audience: "listed", member_count: 1 })).toBe(
      "1 listed person"
    )
  })
})

describe("windowErrors", () => {
  it("accepts blanks and build numbers", () => {
    expect(windowErrors("", "")).toEqual({ min: null, max: null })
    expect(windowErrors(" 1.2.0 ", "2")).toEqual({ min: null, max: null })
    expect(windowErrors("1.2", "1.2.0")).toEqual({ min: null, max: null })
  })

  it("refuses what the API refuses", () => {
    expect(windowErrors("v1.2.0", "")).toEqual({
      min: "Use a build number like 1.2.0.",
      max: null,
    })
    expect(windowErrors("", "1.2.0.4").max).toBe(
      "Use a build number like 1.2.0."
    )
    expect(windowErrors("123456", "").min).not.toBeNull()
  })

  it("refuses a newest build older than the oldest", () => {
    expect(windowErrors("1.10.0", "1.9.0")).toEqual({
      min: null,
      max: "Must be the same as or newer than the oldest build.",
    })
  })
})

describe("drafts", () => {
  const saved = flag({
    min_version: "1.2.0",
    overrides: [rule("android", { enabled: false, max_version: "1.5.0" })],
  })

  it("starts from what is saved", () => {
    expect(draftFrom(saved)).toEqual({
      audience: "everyone",
      min: "1.2.0",
      max: "",
      rules: { android: { enabled: false, min: "", max: "1.5.0" } },
    })
  })

  it("adds and drops a platform's rule", () => {
    const rules = withRule({}, "ios", true)
    expect(rules).toEqual({ ios: { enabled: true, min: "", max: "" } })
    expect(withRule(rules, "ios", false)).toEqual({})
  })

  it("edits only a rule that exists", () => {
    const rules = withRule({}, "ios", true)
    expect(patchRule(rules, "ios", { min: "1.3" }).ios?.min).toBe("1.3")
    expect(patchRule(rules, "web", { enabled: false })).toBe(rules)
  })

  it("checks every window except the web's", () => {
    const draft: FlagDraft = {
      audience: "everyone",
      min: "x",
      max: "",
      rules: {
        ios: { enabled: true, min: "2.0.0", max: "1.0.0" },
        web: { enabled: true, min: "junk", max: "" },
      },
    }
    const errors = draftErrors(draft)
    expect(errors.window.min).not.toBeNull()
    expect(errors.rules.ios?.max).not.toBeNull()
    expect(errors.rules.web).toBeUndefined()
    expect(isDraftReady(draft)).toBe(false)
    expect(isDraftReady(draftFrom(saved))).toBe(true)
  })

  it("sends who it is for, both windows and every rule, blanks as no limit", () => {
    const draft: FlagDraft = {
      audience: "listed",
      min: " 1.2.0 ",
      max: "",
      rules: {
        web: { enabled: false, min: "", max: "" },
        ios: { enabled: true, min: "", max: "1.5" },
      },
    }
    expect(toFlagChanges(draft)).toEqual({
      audience: "listed",
      minVersion: "1.2.0",
      maxVersion: null,
      overrides: [
        { platform: "ios", enabled: true, minVersion: null, maxVersion: "1.5" },
        { platform: "web", enabled: false },
      ],
    })
  })

  it("sends an empty rule set to clear every platform rule", () => {
    expect(
      toFlagChanges({ audience: "everyone", min: "", max: "", rules: {} })
        .overrides
    ).toEqual([])
  })
})

describe("groupByCategory", () => {
  it("groups by category in alphabetical order", () => {
    const groups = groupByCategory([
      flag({ key: "b", category: "wallet" }),
      flag({ key: "a", category: "feed" }),
      flag({ key: "c", category: "wallet" }),
    ])
    expect(groups.map((group) => group.category)).toEqual(["feed", "wallet"])
    expect(groups[1].flags.map((each) => each.key)).toEqual(["b", "c"])
  })
})
