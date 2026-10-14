import { describe, expect, it } from "vitest"
import type { AdminCurrency } from "../types"
import {
  enabledMessage,
  filterCurrencies,
  settingsLine,
  toAmount,
} from "./currencies"

const currency = (
  code: string,
  name: string,
  over: Partial<AdminCurrency> = {}
): AdminCurrency => ({
  code,
  name,
  enabled: false,
  open_in: [],
  missing_settings: 0,
  ...over,
})

const ALL = [
  currency("GHS", "Ghanaian Cedi"),
  currency("KES", "Kenyan Shilling"),
  currency("XAF", "Central African CFA Franc"),
]

describe("filterCurrencies", () => {
  it("finds currencies by name or exact code", () => {
    expect(filterCurrencies(ALL, "shill").map((row) => row.code)).toEqual([
      "KES",
    ])
    expect(filterCurrencies(ALL, "xaf").map((row) => row.code)).toEqual(["XAF"])
    expect(filterCurrencies(ALL, " ")).toHaveLength(3)
  })
})

describe("settingsLine", () => {
  it("says how many amounts are still to set", () => {
    expect(settingsLine(currency("GHS", "Cedi"))).toBe("All set")
    expect(settingsLine(currency("GHS", "Cedi", { missing_settings: 4 }))).toBe(
      "4 to set"
    )
  })
})

describe("enabledMessage", () => {
  it("says what switching money on or off means", () => {
    expect(
      enabledMessage(currency("GHS", "Ghanaian Cedi", { enabled: true }))
    ).toBe(
      "Ghanaian Cedi is on. People whose country uses it can hold and move money."
    )
    expect(enabledMessage(currency("GHS", "Ghanaian Cedi"))).toBe(
      "Ghanaian Cedi is off. Money features are hidden from people whose country uses it."
    )
  })
})

describe("toAmount", () => {
  it("reads an amount in the currency's own units", () => {
    expect(toAmount("1,250.50", "GHS")).toEqual({
      amount: 125_050,
      currency: "GHS",
    })
    expect(toAmount("0", "GHS")).toEqual({ amount: 0, currency: "GHS" })
    expect(toAmount("", "GHS")).toBeNull()
    expect(toAmount("-5", "GHS")).toBeNull()
    expect(toAmount("1.5", "JPY")).toBeNull()
  })
})
