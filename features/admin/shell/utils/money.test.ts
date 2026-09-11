import { describe, expect, it } from "vitest"
import { parseNaira, previewAdjustment } from "./money"

describe("parseNaira", () => {
  it("reads whole and fractional naira as kobo", () => {
    expect(parseNaira("500")).toBe(50_000)
    expect(parseNaira("12.5")).toBe(1_250)
    expect(parseNaira("0.05")).toBe(5)
    expect(parseNaira("1,250,000")).toBe(125_000_000)
    expect(parseNaira(" 7 ")).toBe(700)
  })

  it("refuses what is not an amount", () => {
    expect(parseNaira("")).toBeNull()
    expect(parseNaira("abc")).toBeNull()
    expect(parseNaira("1.234")).toBeNull()
    expect(parseNaira("1e3")).toBeNull()
    expect(parseNaira(".5")).toBeNull()
  })

  it("takes a minus only when asked to", () => {
    expect(parseNaira("-500")).toBeNull()
    expect(parseNaira("-500", { allowNegative: true })).toBe(-50_000)
    expect(parseNaira("-0.5", { allowNegative: true })).toBe(-50)
  })
})

describe("previewAdjustment", () => {
  it("waits quietly while the field is empty", () => {
    expect(previewAdjustment(1000, "")).toEqual({ ok: false, message: null })
  })

  it("adds and takes away in kobo", () => {
    expect(previewAdjustment(1000, "5")).toEqual({
      ok: true,
      delta: 500,
      next: 1500,
    })
    expect(previewAdjustment(1000, "-2.5")).toEqual({
      ok: true,
      delta: -250,
      next: 750,
    })
  })

  it("refuses nonsense, zero and going below zero", () => {
    expect(previewAdjustment(1000, "abc").ok).toBe(false)
    expect(previewAdjustment(1000, "0")).toEqual({
      ok: false,
      message: "Enter an amount other than zero.",
    })
    expect(previewAdjustment(1000, "-11")).toEqual({
      ok: false,
      message: "That would take them below zero.",
    })
  })
})
