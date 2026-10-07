import { describe, expect, it } from "vitest"
import {
  isHttpsLink,
  LINK_OPTIONS,
  LINK_PRESETS,
  linkFor,
  linkHint,
  linkUrl,
  presetUrl,
} from "./links"

describe("presets", () => {
  it("points every preset at a real page on snacc.fyi", () => {
    expect(LINK_PRESETS.map((preset) => presetUrl(preset.key))).toEqual([
      "https://snacc.fyi/premium",
      "https://snacc.fyi/invite",
      "https://snacc.fyi/score",
      "https://snacc.fyi/wallet",
      "https://snacc.fyi/earnings",
      "https://snacc.fyi/eggs",
      "https://snacc.fyi/hangouts",
      "https://snacc.fyi/edit-profile",
    ])
  })

  it("offers another link last", () => {
    expect(LINK_OPTIONS.at(-1)).toEqual({
      value: "other",
      label: "Another link",
    })
  })
})

describe("linkFor and linkUrl", () => {
  it("recognises a preset and keeps anything else as its own link", () => {
    expect(linkFor("https://snacc.fyi/premium")).toEqual({
      link: "premium",
      url: "",
    })
    expect(linkFor("https://snacc.fyi/snacc/01J")).toEqual({
      link: "other",
      url: "https://snacc.fyi/snacc/01J",
    })
  })

  it("turns a choice back into the link to send", () => {
    expect(linkUrl("score", "ignored")).toBe("https://snacc.fyi/score")
    expect(linkUrl("other", " https://example.com/a ")).toBe(
      "https://example.com/a"
    )
    expect(linkUrl(null, "https://example.com")).toBe("")
  })
})

describe("isHttpsLink", () => {
  it("takes full https links only", () => {
    expect(isHttpsLink("https://example.com/path?x=1")).toBe(true)
    expect(isHttpsLink(" https://snacc.fyi/premium ")).toBe(true)
    expect(isHttpsLink("http://example.com")).toBe(false)
    expect(isHttpsLink("example.com")).toBe(false)
    expect(isHttpsLink("https://localhost")).toBe(false)
    expect(isHttpsLink("https://exa mple.com")).toBe(false)
    expect(isHttpsLink(`https://example.com/${"a".repeat(500)}`)).toBe(false)
  })
})

describe("linkHint", () => {
  it("explains where links open before anything is pasted", () => {
    expect(linkHint("")).toEqual({
      text: "A snacc.fyi link opens inside Snacc. Any other https link opens in their browser.",
      problem: false,
    })
  })

  it("says where a pasted link opens, or what is wrong with it", () => {
    expect(linkHint("https://snacc.fyi/snacc/01J").text).toBe(
      "Opens inside Snacc."
    )
    expect(linkHint("https://www.snacc.fyi/premium").text).toBe(
      "Opens inside Snacc."
    )
    expect(linkHint("https://example.com").text).toBe("Opens in their browser.")
    expect(linkHint("snacc.fyi/premium").problem).toBe(true)
  })
})
