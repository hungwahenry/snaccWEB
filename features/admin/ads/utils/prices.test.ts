import { describe, expect, it } from "vitest"
import { money } from "@/lib/money"
import { priceInvalid, priceProblem, toPrice } from "./prices"

describe("toPrice", () => {
  it("takes whole steps of the smallest price, in the campus currency", () => {
    expect(toPrice("1000", "USD")).toEqual(money(100_000, "USD"))
    expect(toPrice("1,250", "USD")).toEqual(money(125_000, "USD"))
    expect(toPrice("10", "USD")).toEqual(money(1000, "USD"))
    expect(toPrice("1000", "JPY")).toEqual(money(1000, "JPY"))
  })

  it("refuses anything off the step or below it", () => {
    expect(toPrice("1005", "USD")).toBeNull()
    expect(toPrice("1000.50", "USD")).toBeNull()
    expect(toPrice("0", "USD")).toBeNull()
    expect(toPrice("-1000", "USD")).toBeNull()
    expect(toPrice("abc", "USD")).toBeNull()
  })
})

describe("priceProblem", () => {
  it("says nothing until something unusable is typed", () => {
    expect(priceProblem("", "USD")).toBeNull()
    expect(priceProblem("1000", "USD")).toBeNull()
    expect(priceProblem("15", "USD")).toBe(priceInvalid("USD"))
  })
})
