import { describe, expect, it } from "vitest"
import type { AdminWithdrawal } from "../types"
import { STATUS_OPTIONS, WITHDRAWAL_STATUS } from "./status"
import { accountLine, canRetry, waitingNote } from "./withdrawals"

const withdrawal = (patch: Partial<AdminWithdrawal> = {}): AdminWithdrawal => ({
  id: "w1",
  reference: "WD-1",
  amount: 100_000,
  status: "pending",
  bank_name: "GTBank",
  account_last4: "1234",
  account_name: "Bola A",
  recipient_code: "RCP_1",
  balance_before: 200_000,
  balance_after: 100_000,
  transfer_code: null,
  failure_reason: null,
  completed_at: null,
  created_at: "2026-09-01T00:00:00Z",
  user: {
    id: "u1",
    username: "bola",
    display_name: "Bola",
    avatar_url: "",
    university: null,
  },
  events: [],
  ...patch,
})

describe("waitingNote", () => {
  const now = Date.parse("2026-09-10T12:00:00Z")

  it("says when nothing is waiting", () => {
    expect(waitingNote({ count: 0, total: 0, oldest_at: null }, now)).toBe(
      "Nothing waiting"
    )
  })

  it("counts what is waiting and how old the oldest is", () => {
    expect(
      waitingNote(
        { count: 2, total: 5_000, oldest_at: "2026-09-10T08:00:00Z" },
        now
      )
    ).toBe("2 withdrawals · oldest from today")
    expect(
      waitingNote(
        { count: 1, total: 5_000, oldest_at: "2026-09-07T08:00:00Z" },
        now
      )
    ).toBe("1 withdrawal · oldest 3 days old")
  })
})

describe("accountLine", () => {
  it("shows the full number only when the API shares it", () => {
    expect(accountLine(withdrawal())).toBe("•••• 1234")
    expect(accountLine(withdrawal({ account_number: "0123451234" }))).toBe(
      "0123451234"
    )
  })
})

describe("canRetry", () => {
  it("only offers a retry while Paystack still has it", () => {
    expect(canRetry(withdrawal())).toBe(true)
    expect(canRetry(withdrawal({ status: "success" }))).toBe(false)
  })
})

describe("statuses", () => {
  it("names every status in plain words", () => {
    expect(WITHDRAWAL_STATUS.pending.label).toBe("With Paystack")
    expect(STATUS_OPTIONS.map((option) => option.value)).toEqual([
      "pending",
      "success",
      "failed",
      "reversed",
    ])
  })
})
