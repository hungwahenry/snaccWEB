import { describe, expect, it } from "vitest"
import {
  addMoney,
  currencySymbol,
  formatMoney,
  formatTotals,
  inputToMoney,
  money,
  moneyToInput,
  subtractMoney,
} from "./money"

describe("formatMoney", () => {
  it("shows the smaller units only when there are some", () => {
    expect(formatMoney(money(150_000, "NGN"))).toBe("₦1,500")
    expect(formatMoney(money(150_050, "NGN"))).toBe("₦1,500.50")
  })

  it("follows each currency's own symbol and decimals", () => {
    expect(formatMoney(money(1_500, "JPY"))).toBe("¥1,500")
    expect(formatMoney(money(5_000, "GHS"))).toBe("GH₵50")
    expect(currencySymbol("NGN")).toBe("₦")
  })

  it("lists totals per currency, never added together", () => {
    expect(formatTotals([money(150_000, "NGN"), money(5_000, "GHS")])).toBe(
      "₦1,500 · GH₵50"
    )
    expect(formatTotals([])).toBe("—")
  })
})

describe("amounts and input", () => {
  it("round-trips an amount through what someone types, in its own decimals", () => {
    expect(moneyToInput(money(150_000, "NGN"))).toBe("1500")
    expect(moneyToInput(money(150_050, "NGN"))).toBe("1500.50")
    expect(inputToMoney("1500.5", "NGN")).toEqual(money(150_050, "NGN"))
    expect(inputToMoney("1500", "JPY")).toEqual(money(1_500, "JPY"))
    expect(inputToMoney("12a", "NGN")).toEqual(money(0, "NGN"))
  })
})

describe("arithmetic", () => {
  it("stays inside one currency", () => {
    expect(addMoney(money(1, "NGN"), money(2, "NGN"))).toEqual(money(3, "NGN"))
    expect(subtractMoney(money(5, "NGN"), money(2, "NGN"))).toEqual(
      money(3, "NGN")
    )
    expect(() => addMoney(money(1, "NGN"), money(1, "GHS"))).toThrow()
  })
})
