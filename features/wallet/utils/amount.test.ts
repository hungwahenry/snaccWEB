import { describe, expect, it } from "vitest"
import { amountSize, groupAmount, typeAmount } from "./amount"

describe("typeAmount", () => {
  it("appends digits and replaces a lone zero", () => {
    expect(typeAmount("", "5")).toBe("5")
    expect(typeAmount("0", "5")).toBe("5")
    expect(typeAmount("12", "3")).toBe("123")
  })

  it("deletes the last character", () => {
    expect(typeAmount("123", "back")).toBe("12")
    expect(typeAmount("", "back")).toBe("")
  })

  it("starts decimals with a leading zero and allows only one point", () => {
    expect(typeAmount("", ".")).toBe("0.")
    expect(typeAmount("5", ".")).toBe("5.")
    expect(typeAmount("5.2", ".")).toBe("5.2")
  })

  it("stops at kobo", () => {
    expect(typeAmount("5.25", "1")).toBe("5.25")
  })

  it("refuses to pass the cap", () => {
    expect(typeAmount("10000000", "0")).toBe("10000000")
    expect(typeAmount("999", "9", 100_000)).toBe("999")
  })

  it("ignores keys that are not digits", () => {
    expect(typeAmount("12", "x")).toBe("12")
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
