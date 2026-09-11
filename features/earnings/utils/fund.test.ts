import { describe, expect, it } from "vitest"
import { fundLook, snaccPreviewText } from "./fund"

describe("fundLook", () => {
  it("says where you rank and how much is shared", () => {
    expect(
      fundLook({
        cap: 1_000_000,
        distributed: 250_000,
        you: 5_000,
        rank: 3,
        earners: 40,
      })
    ).toEqual({
      standing: "#3 of 40 earners",
      shared: "₦2,500 shared",
      cap: "of ₦10,000",
      percent: 25,
    })
  })

  it("counts earners when you have no rank yet", () => {
    expect(
      fundLook({ cap: 1_000, distributed: 0, you: 0, rank: null, earners: 12 })
        .standing
    ).toBe("12 earning")
  })
})

describe("snaccPreviewText", () => {
  it("falls back for a snacc with no words", () => {
    expect(snaccPreviewText({ body: "hello" })).toBe("hello")
    expect(snaccPreviewText({ body: null })).toBe("A snacc")
    expect(snaccPreviewText({ body: "  " })).toBe("A snacc")
  })
})
