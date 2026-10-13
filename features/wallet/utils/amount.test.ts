import { describe, expect, it } from "vitest"
import { amountSize, groupAmount, typeAmount } from "./amount"

describe("typeAmount", () => {
  it("appends digits and replaces a lone zero", () => {
    expect(typeAmount("", "5", "USD")).toBe("5")
    expect(typeAmount("0", "5", "USD")).toBe("5")
    expect(typeAmount("12", "3", "USD")).toBe("123")
  })

  it("deletes the last character", () => {
    expect(typeAmount("123", "back", "USD")).toBe("12")
    expect(typeAmount("", "back", "USD")).toBe("")
  })

  it("starts decimals with a leading zero and allows only one point", () => {
    expect(typeAmount("", ".", "USD")).toBe("0.")
    expect(typeAmount("5", ".", "USD")).toBe("5.")
    expect(typeAmount("5.2", ".", "USD")).toBe("5.2")
  })

  it("stops at the decimals the currency has", () => {
    expect(typeAmount("5.25", "1", "USD")).toBe("5.25")
    expect(typeAmount("5", ".", "JPY")).toBe("5")
  })

  it("refuses to pass the cap", () => {
    expect(typeAmount("10000000", "0", "USD")).toBe("10000000")
    expect(typeAmount("999", "9", "USD", 1_000)).toBe("999")
  })

  it("ignores keys that are not digits", () => {
    expect(typeAmount("12", "x", "USD")).toBe("12")
  })
})

describe("groupAmount", () => {
  it("groups thousands and keeps typed decimals", () => {
    expect(groupAmount("")).toBe("0")
    expect(groupAmount("1234567")).toBe("1,234,567")
    expect(groupAmount("1234.")).toBe("1,234.")
    expect(groupAmount("1234.5")).toBe("1,234.5")
  })
})

describe("amountSize", () => {
  it("shrinks as the amount grows", () => {
    expect(amountSize("1,000").amount).toBe(64)
    expect(amountSize("1,000,000").amount).toBe(52)
    expect(amountSize("10,000,000.5").amount).toBe(40)
    expect(amountSize("10,000,000.55").amount).toBe(32)
  })
})
