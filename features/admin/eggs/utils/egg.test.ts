import { describe, expect, it } from "vitest"
import type { AdminEgg } from "../types"
import {
  draftFrom,
  eggStatus,
  isDraftReady,
  parseTrigger,
  RARITY_LABELS,
  RARITY_OPTIONS,
  toCreateInput,
  toUpdateInput,
  TRIGGER_INVALID,
  triggerText,
} from "./egg"

const egg = (overrides: Partial<AdminEgg> = {}): AdminEgg => ({
  id: "e1",
  slug: "sevens",
  name: "Sevens",
  description: "Tap the wordmark seven times.",
  hint: null,
  rarity: "rare",
  color: "#c23d6e",
  image_url: null,
  enabled: true,
  seeded: false,
  trigger: { on: "tap" },
  discoveries_count: 3,
  ...overrides,
})

const ready = {
  ...draftFrom(),
  slug: "tuesday-surprise",
  name: "Tuesday",
  description: "Found on a Tuesday.",
}

describe("rarity and status labels", () => {
  it("reads in sentence case, in rarity order", () => {
    expect(RARITY_LABELS.legendary).toBe("Legendary")
    expect(RARITY_OPTIONS.map((option) => option.value)).toEqual([
      "common",
      "uncommon",
      "rare",
      "epic",
      "legendary",
    ])
  })

  it("names live and switched-off eggs", () => {
    expect(eggStatus({ enabled: true }).label).toBe("Live")
    expect(eggStatus({ enabled: false }).label).toBe("Off")
  })
})

describe("triggers", () => {
  it("shows no trigger as blank and a trigger as indented JSON", () => {
    expect(triggerText(null)).toBe("")
    expect(triggerText(undefined)).toBe("")
    expect(triggerText({ on: "tap" })).toBe('{\n  "on": "tap"\n}')
  })

  it("treats blank as no trigger and refuses anything but an object", () => {
    expect(parseTrigger("  ")).toEqual({ ok: true, value: null })
    expect(parseTrigger('{"on":"tap"}')).toEqual({
      ok: true,
      value: { on: "tap" },
    })
    expect(parseTrigger("[1]").ok).toBe(false)
    expect(parseTrigger("{on:").ok).toBe(false)
  })
})

describe("drafts", () => {
  it("starts a new egg common, on and in the default colour", () => {
    expect(draftFrom()).toMatchObject({
      rarity: "common",
      enabled: true,
      color: "#5b6ec2",
      trigger: "",
      hint: "",
    })
  })

  it("fills from an existing egg", () => {
    expect(draftFrom(egg({ hint: "Count", enabled: false }))).toMatchObject({
      name: "Sevens",
      hint: "Count",
      enabled: false,
      trigger: '{\n  "on": "tap"\n}',
    })
  })

  it("needs a name, a description and a hex colour", () => {
    expect(isDraftReady(ready, false)).toBe(true)
    expect(isDraftReady({ ...ready, name: " " }, false)).toBe(false)
    expect(isDraftReady({ ...ready, description: "" }, false)).toBe(false)
    expect(isDraftReady({ ...ready, color: "#c23d6" }, false)).toBe(false)
    expect(isDraftReady({ ...ready, color: "red" }, false)).toBe(false)
  })

  it("holds the text limits", () => {
    expect(isDraftReady({ ...ready, name: "x".repeat(61) }, false)).toBe(false)
    expect(isDraftReady({ ...ready, hint: "x".repeat(121) }, false)).toBe(false)
  })

  it("checks the slug only when creating", () => {
    const bad = { ...ready, slug: "no spaces" }
    expect(isDraftReady(bad, false)).toBe(false)
    expect(isDraftReady(bad, true)).toBe(true)
    expect(isDraftReady({ ...ready, slug: "ab" }, false)).toBe(false)
    expect(isDraftReady({ ...ready, slug: " Big-Egg " }, false)).toBe(true)
  })

  it("is not ready while the trigger is broken", () => {
    expect(isDraftReady({ ...ready, trigger: "{" }, true)).toBe(false)
    expect(isDraftReady({ ...ready, trigger: "" }, true)).toBe(true)
  })
})

describe("toCreateInput", () => {
  it("trims, lowercases the slug and leaves out what is blank", () => {
    expect(
      toCreateInput({
        ...ready,
        slug: " Big-Egg ",
        name: " Big ",
        hint: " ",
        color: " #C23D6E ",
      })
    ).toEqual({
      slug: "big-egg",
      name: "Big",
      description: "Found on a Tuesday.",
      hint: undefined,
      rarity: "common",
      color: "#C23D6E",
      trigger: undefined,
    })
  })

  it("sends the trigger as an object", () => {
    expect(
      toCreateInput({ ...ready, trigger: '{"on":"tap"}' }).trigger
    ).toEqual({ on: "tap" })
  })

  it("refuses a broken trigger rather than dropping it", () => {
    expect(() => toCreateInput({ ...ready, trigger: "{" })).toThrow(
      TRIGGER_INVALID
    )
  })
})

describe("toUpdateInput", () => {
  it("sends a cleared hint and trigger so they actually clear", () => {
    const input = toUpdateInput({
      ...draftFrom(egg({ hint: "Count" })),
      hint: " ",
      trigger: "",
    })
    expect(input.hint).toBe("")
    expect(input.trigger).toBeNull()
  })

  it("never sends the slug or rarity, which cannot change", () => {
    const input = toUpdateInput(draftFrom(egg()))
    expect(input).not.toHaveProperty("slug")
    expect(input).not.toHaveProperty("rarity")
    expect(input.enabled).toBe(true)
  })
})
