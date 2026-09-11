import { describe, expect, it } from "vitest"
import type { MoneyPerson, WalletRecipient } from "../types"
import {
  bankTarget,
  canTarget,
  forgetRecipientTitle,
  isAccountNumber,
  recipientLabel,
  recipientsFor,
  targetFromRecipient,
  targetLabel,
  targetName,
  userNamed,
} from "./recipients"

const ada: MoneyPerson = {
  id: "u1",
  username: "ada",
  display_name: "Ada Obi",
  avatar_url: "",
  university: null,
  score: { tier: null, og: false },
  official: false,
  premium: false,
  is_birthday: false,
}

const userRecipient: WalletRecipient = {
  id: "r1",
  kind: "user",
  last_used_at: "2026-01-01T00:00:00Z",
  times_used: 2,
  user: ada,
  bank: null,
}

const bankRecipient: WalletRecipient = {
  id: "r2",
  kind: "bank",
  last_used_at: "2026-01-01T00:00:00Z",
  times_used: 1,
  user: null,
  bank: {
    bank_code: "058",
    bank_name: "GTBank",
    account_last4: "6789",
    account_name: "Ada Obi",
  },
}

describe("isAccountNumber", () => {
  it("is exactly ten digits", () => {
    expect(isAccountNumber(" 0123456789 ")).toBe(true)
    expect(isAccountNumber("012345678")).toBe(false)
    expect(isAccountNumber("@ada")).toBe(false)
  })
})

describe("canTarget and recipientsFor", () => {
  it("never asks a bank account for money", () => {
    expect(canTarget("request", bankRecipient)).toBe(false)
    expect(canTarget("send", bankRecipient)).toBe(true)
    expect(canTarget("send", null)).toBe(false)
    expect(recipientsFor("request", [userRecipient, bankRecipient])).toEqual([
      userRecipient,
    ])
  })
})

describe("targetFromRecipient", () => {
  it("turns a recent into who to pay", () => {
    expect(targetFromRecipient(userRecipient)).toEqual({
      kind: "user",
      user: ada,
    })
    expect(targetFromRecipient(bankRecipient)).toEqual({
      kind: "bank",
      bankName: "GTBank",
      accountName: "Ada Obi",
      accountLast4: "6789",
      source: { recipientId: "r2" },
    })
  })

  it("gives nothing for a recent missing its details", () => {
    expect(targetFromRecipient({ ...userRecipient, user: null })).toBeNull()
    expect(
      targetFromRecipient({
        ...bankRecipient,
        bank: { ...bankRecipient.bank!, account_name: null },
      })
    ).toBeNull()
  })
})

describe("labels", () => {
  it("shows the full number only when it was just typed", () => {
    const typed = bankTarget(
      { name: "GTBank", code: "058" },
      "0123456789",
      "Ada Obi"
    )
    expect(targetLabel(typed).subtitle).toBe("GTBank · 0123456789")
    expect(targetLabel(targetFromRecipient(bankRecipient)!).subtitle).toBe(
      "GTBank · ••6789"
    )
  })

  it("names a person by handle", () => {
    expect(targetLabel({ kind: "user", user: ada })).toEqual({
      title: "@ada",
      subtitle: "Ada Obi",
      short: "@ada",
    })
    expect(targetName({ kind: "user", user: ada })).toBe("@ada")
  })

  it("labels recents", () => {
    expect(recipientLabel(userRecipient).short).toBe("@ada")
    expect(recipientLabel(bankRecipient)).toEqual({
      title: "Ada Obi",
      subtitle: "GTBank ••6789",
      short: "GTBank",
    })
  })

  it("asks to forget a recent by what it is", () => {
    expect(forgetRecipientTitle(userRecipient)).toBe(
      "Remove @ada from recents?"
    )
    expect(forgetRecipientTitle(bankRecipient)).toBe(
      "Remove GTBank ••6789 from recents?"
    )
  })
})

describe("userNamed", () => {
  it("matches a username exactly, ignoring case", () => {
    expect(userNamed([ada], "ADA")).toBe(ada)
    expect(userNamed([ada], "ad")).toBeNull()
  })
})
