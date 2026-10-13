import { describe, expect, it } from "vitest"
import { money } from "@/lib/money"
import { parseAmount, previewAdjustment } from "./money"

const usd = (amount: number) => money(amount, "USD")

describe("parseAmount", () => {
  it("reads whole and fractional units in the currency's smallest unit", () => {
    expect(parseAmount("500", "USD")).toEqual(usd(50_000))
    expect(parseAmount("12.5", "USD")).toEqual(usd(1_250))
    expect(parseAmount("0.05", "USD")).toEqual(usd(5))
    expect(parseAmount("1,250,000", "USD")).toEqual(usd(125_000_000))
    expect(parseAmount(" 7 ", "USD")).toEqual(usd(700))
    expect(parseAmount("500", "JPY")).toEqual(money(500, "JPY"))
  })

  it("refuses what is not an amount", () => {
    expect(parseAmount("", "USD")).toBeNull()
    expect(parseAmount("abc", "USD")).toBeNull()
    expect(parseAmount("1.234", "USD")).toBeNull()
    expect(parseAmount("1.5", "JPY")).toBeNull()
    expect(parseAmount("1e3", "USD")).toBeNull()
    expect(parseAmount(".5", "USD")).toBeNull()
  })

  it("takes a minus only when asked to", () => {
    expect(parseAmount("-500", "USD")).toBeNull()
    expect(parseAmount("-500", "USD", { allowNegative: true })).toEqual(
      usd(-50_000)
    )
    expect(parseAmount("-0.5", "USD", { allowNegative: true })).toEqual(
      usd(-50)
    )
  })
})

describe("previewAdjustment", () => {
  it("waits quietly while the field is empty", () => {
    expect(previewAdjustment(usd(1000), "")).toEqual({
      ok: false,
      message: null,
    })
  })

  it("adds and takes away in the balance's currency", () => {
    expect(previewAdjustment(usd(1000), "5")).toEqual({
      ok: true,
      delta: usd(500),
      next: usd(1500),
    })
    expect(previewAdjustment(usd(1000), "-2.5")).toEqual({
      ok: true,
      delta: usd(-250),
      next: usd(750),
    })
  })

  it("refuses nonsense, zero and going below zero", () => {
    expect(previewAdjustment(usd(1000), "abc").ok).toBe(false)
    expect(previewAdjustment(usd(1000), "0")).toEqual({
      ok: false,
      message: "Enter an amount other than zero.",
    })
    expect(previewAdjustment(usd(1000), "-11")).toEqual({
      ok: false,
      message: "That would take them below zero.",
    })
  })
})
