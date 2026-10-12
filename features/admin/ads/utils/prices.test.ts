import { describe, expect, it } from "vitest"
import { PRICE_INVALID, priceProblem, toPriceKobo } from "./prices"

describe("toPriceKobo", () => {
  it("takes naira in steps of ₦10", () => {
    expect(toPriceKobo("1000")).toBe(100_000)
    expect(toPriceKobo("1,250")).toBe(125_000)
    expect(toPriceKobo("10")).toBe(1000)
  })

  it("refuses kobo, odd steps, zero and junk", () => {
    expect(toPriceKobo("1005")).toBeNull()
    expect(toPriceKobo("1000.50")).toBeNull()
    expect(toPriceKobo("0")).toBeNull()
    expect(toPriceKobo("-1000")).toBeNull()
    expect(toPriceKobo("abc")).toBeNull()
  })
})

describe("priceProblem", () => {
  it("stays quiet until something is typed", () => {
    expect(priceProblem("")).toBeNull()
    expect(priceProblem("1000")).toBeNull()
    expect(priceProblem("15")).toBe(PRICE_INVALID)
  })
})
