import { describe, expect, it } from "vitest"
import type { VirtualAccount } from "../types"
import {
  accountShareText,
  balanceText,
  groupAccountNumber,
  HIDDEN_BALANCE,
} from "./format"

const account: VirtualAccount = {
  status: "active",
  account_number: "0123456789",
  account_name: "Ada Obi",
  bank_name: "Wema Bank",
  failure_reason: null,
}

describe("groupAccountNumber", () => {
  it("groups a ten-digit number 3-3-4", () => {
    expect(groupAccountNumber("0123456789")).toBe("012 345 6789")
  })

  it("leaves anything else alone", () => {
    expect(groupAccountNumber("12345")).toBe("12345")
  })
})

describe("accountShareText", () => {
  it("puts bank, number and name on their own lines", () => {
    expect(accountShareText(account)).toBe("Wema Bank\n0123456789\nAda Obi")
  })

  it("skips what is not known yet", () => {
    expect(accountShareText({ ...account, bank_name: null })).toBe(
      "0123456789\nAda Obi"
    )
  })
})

describe("balanceText", () => {
  it("masks the balance when hidden", () => {
    expect(balanceText(150000, true)).toBe(HIDDEN_BALANCE)
  })

  it("shows naira otherwise", () => {
    expect(balanceText(150000, false)).toBe("₦1,500")
  })
})
