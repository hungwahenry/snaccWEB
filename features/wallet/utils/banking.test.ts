import { describe, expect, it } from "vitest"
import type { Banking } from "../types"
import { isAccountNumber, isBankAccount, offers } from "./banking"

const banking: Banking = {
  country: "Testland",
  deposit_methods: ["bank_transfer"],
  payout_methods: ["bank_account"],
  account_number_length: 8,
  id: null,
}

describe("offers", () => {
  it("knows how money moves where the person lives", () => {
    expect(offers(banking, "bank_transfer")).toBe(true)
    expect(offers(banking, "dedicated_account")).toBe(false)
    expect(offers(null, "bank_transfer")).toBe(false)
  })
})

describe("account numbers", () => {
  it("takes as many digits as numbers have there", () => {
    expect(isAccountNumber(" 12345678 ", 8)).toBe(true)
    expect(isAccountNumber("1234567", 8)).toBe(false)
    expect(isAccountNumber("1234567a", 8)).toBe(false)
  })

  it("reads a number as a bank account only where money can go to one", () => {
    expect(isBankAccount("12345678", banking)).toBe(true)
    expect(isBankAccount("12345678", { ...banking, payout_methods: [] })).toBe(
      false
    )
    expect(isBankAccount("12345678", null)).toBe(false)
    expect(isBankAccount("@ada", banking)).toBe(false)
  })
})
