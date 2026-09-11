import { describe, expect, it } from "vitest"
import type { VirtualAccount } from "../types"
import { activeAccountNumber, receiveView } from "./virtual-account"

const account = (overrides: Partial<VirtualAccount>): VirtualAccount => ({
  status: "active",
  account_number: "0123456789",
  account_name: "SNACC/ADA OBI",
  bank_name: "Wema Bank",
  failure_reason: null,
  ...overrides,
})

describe("receiveView", () => {
  it("waits, then fails only when there is nothing to show", () => {
    expect(receiveView({ loading: true, failed: false, account: null })).toBe(
      "loading"
    )
    expect(receiveView({ loading: false, failed: true, account: null })).toBe(
      "failed"
    )
    expect(
      receiveView({ loading: false, failed: true, account: account({}) })
    ).toBe("active")
  })

  it("shows progress while it opens", () => {
    expect(
      receiveView({
        loading: false,
        failed: false,
        account: account({ status: "pending" }),
      })
    ).toBe("pending")
  })

  it("offers the form when there is none, or the last try failed", () => {
    expect(receiveView({ loading: false, failed: false, account: null })).toBe(
      "activate"
    )
    expect(
      receiveView({
        loading: false,
        failed: false,
        account: account({ status: "failed" }),
      })
    ).toBe("activate")
  })
})

describe("activeAccountNumber", () => {
  it("gives the number only for an open account", () => {
    expect(activeAccountNumber(account({}))).toBe("0123456789")
    expect(activeAccountNumber(account({ status: "pending" }))).toBeNull()
    expect(activeAccountNumber(null)).toBeNull()
  })
})
