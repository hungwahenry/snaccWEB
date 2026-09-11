import { describe, expect, it } from "vitest"
import type { AdminConfigSetting } from "../types"
import {
  checkDraft,
  defaultDraft,
  draftFrom,
  editableText,
  groupByCategory,
  isDraftReady,
  parseConfigValue,
  previewValue,
  toUpdateInput,
  valueKind,
  wantsWholeNumber,
} from "./config"

const setting = (
  value: unknown,
  overrides: Partial<AdminConfigSetting> = {}
): AdminConfigSetting => ({
  key: "feed.page_size",
  value,
  default_value: value,
  is_default: true,
  is_public: false,
  category: "feed",
  description: "",
  updated_at: "2026-09-01T00:00:00Z",
  ...overrides,
})

describe("valueKind", () => {
  it("edits each JSON type its own way", () => {
    expect(valueKind(true)).toBe("boolean")
    expect(valueKind(3)).toBe("number")
    expect(valueKind("pg-13")).toBe("text")
    expect(valueKind(["a"])).toBe("json")
    expect(valueKind({ a: 1 })).toBe("json")
  })
})

describe("wantsWholeNumber", () => {
  it("follows what the code ships", () => {
    expect(wantsWholeNumber(setting(20))).toBe(true)
    expect(wantsWholeNumber(setting(0.5))).toBe(false)
    expect(wantsWholeNumber(setting(3, { default_value: null }))).toBe(false)
  })
})

describe("parseConfigValue", () => {
  it("takes on or off for a switch", () => {
    expect(parseConfigValue(setting(false), true)).toEqual({
      ok: true,
      value: true,
    })
    expect(parseConfigValue(setting(false), "true").ok).toBe(false)
  })

  it("holds a whole-number setting to whole numbers of 0 or more", () => {
    expect(parseConfigValue(setting(20), " 25 ")).toEqual({
      ok: true,
      value: 25,
    })
    expect(parseConfigValue(setting(20), "2.5")).toEqual({
      ok: false,
      message: "Use a whole number of 0 or more.",
    })
    expect(parseConfigValue(setting(20), "-1").ok).toBe(false)
    expect(parseConfigValue(setting(20), "").ok).toBe(false)
  })

  it("lets a fractional setting stay fractional, and refuses words", () => {
    expect(parseConfigValue(setting(0.5), "0.25")).toEqual({
      ok: true,
      value: 0.25,
    })
    expect(parseConfigValue(setting(0.5), "-1.5")).toEqual({
      ok: true,
      value: -1.5,
    })
    expect(parseConfigValue(setting(0.5), "half").ok).toBe(false)
    expect(parseConfigValue(setting(0.5), "1e3").ok).toBe(false)
  })

  it("trims text", () => {
    expect(parseConfigValue(setting("pg"), " pg-13 ")).toEqual({
      ok: true,
      value: "pg-13",
    })
    expect(parseConfigValue(setting("pg"), "")).toEqual({ ok: true, value: "" })
  })

  it("refuses broken JSON", () => {
    expect(parseConfigValue(setting(["a"]), '["a",').ok).toBe(false)
  })

  it("keeps a list a list and an object an object", () => {
    expect(parseConfigValue(setting(["a"]), '["b"]')).toEqual({
      ok: true,
      value: ["b"],
    })
    expect(parseConfigValue(setting(["a"]), '{"a":1}')).toEqual({
      ok: false,
      message: "This setting takes a list, in square brackets.",
    })
    expect(parseConfigValue(setting({ a: 1 }), "[1]")).toEqual({
      ok: false,
      message: "This setting takes an object, in curly braces.",
    })
    expect(parseConfigValue(setting({ a: 1 }), "5").ok).toBe(false)
  })
})

describe("editableText and previewValue", () => {
  it("pretty-prints JSON for editing and leaves the rest as typed", () => {
    expect(editableText({ a: 1 })).toBe('{\n  "a": 1\n}')
    expect(editableText(12)).toBe("12")
    expect(editableText("x")).toBe("x")
    expect(editableText(true)).toBe("")
  })

  it("names an empty string rather than showing nothing", () => {
    expect(previewValue("")).toBeNull()
    expect(previewValue("pg")).toBe("pg")
    expect(previewValue(["a"])).toBe('["a"]')
    expect(previewValue(false)).toBe("false")
  })
})

describe("drafts", () => {
  it("starts from what is saved", () => {
    expect(draftFrom(setting(true, { is_public: true }))).toEqual({
      text: "",
      on: true,
      isPublic: true,
    })
    expect(draftFrom(setting(20)).text).toBe("20")
  })

  it("checks the switch for a boolean and the text otherwise", () => {
    const flag = setting(false)
    expect(checkDraft(flag, { ...draftFrom(flag), on: true })).toEqual({
      ok: true,
      value: true,
    })
    const size = setting(20)
    expect(checkDraft(size, { ...draftFrom(size), text: "x" }).ok).toBe(false)
  })

  it("puts back the shipped value but keeps the visibility", () => {
    const tuned = setting(40, { default_value: 20, is_default: false })
    const draft = { ...draftFrom(tuned), isPublic: true }
    expect(defaultDraft(tuned, draft)).toEqual({
      text: "20",
      on: false,
      isPublic: true,
    })
  })

  it("sends only what changed", () => {
    const size = setting(20)
    expect(toUpdateInput(size, { ...draftFrom(size), text: "30" })).toEqual({
      value: 30,
    })
    expect(toUpdateInput(size, { ...draftFrom(size), isPublic: true })).toEqual(
      { isPublic: true }
    )
  })

  it("refuses to build an update from a bad value", () => {
    const size = setting(20)
    expect(() =>
      toUpdateInput(size, { ...draftFrom(size), text: "x" })
    ).toThrow("Use a whole number of 0 or more.")
  })

  it("is ready only when valid and changed", () => {
    const size = setting(20)
    expect(isDraftReady(size, draftFrom(size))).toBe(false)
    expect(isDraftReady(size, { ...draftFrom(size), text: "30" })).toBe(true)
    expect(isDraftReady(size, { ...draftFrom(size), text: "3.5" })).toBe(false)
    const list = setting(["a"])
    expect(
      isDraftReady(list, { ...draftFrom(list), text: '[\n  "a"\n]' })
    ).toBe(false)
  })
})

describe("groupByCategory", () => {
  it("groups by category in alphabetical order, keeping row order", () => {
    const groups = groupByCategory([
      setting(1, { key: "wallet.b", category: "wallet" }),
      setting(1, { key: "feed.a", category: "feed" }),
      setting(1, { key: "wallet.a", category: "wallet" }),
    ])
    expect(groups.map((group) => group.category)).toEqual(["feed", "wallet"])
    expect(groups[1].settings.map((each) => each.key)).toEqual([
      "wallet.b",
      "wallet.a",
    ])
    expect(groupByCategory([])).toEqual([])
  })
})
