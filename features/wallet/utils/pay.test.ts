import { describe, expect, it } from "vitest"
import type { WalletLimits } from "../types"
import {
  amountFix,
  amountHint,
  checkAmount,
  leftToday,
  limitRail,
  requestShortfall,
  sendsToBank,
  topUpFor,
  type AmountRules,
} from "./pay"

const base: AmountRules = {
  mode: "send",
  amountKobo: 50000,
  minKobo: 10000,
  maxKobo: 1_000_000_000,
  feeKobo: 2500,
  balance: 100000,
  leftToday: null,
}

describe("checkAmount", () => {
  it("is ready for an amount within every rule", () => {
    const check = checkAmount(base)
    expect(check).toMatchObject({ ready: true, problem: null, fee: 2500 })
    expect(check.total).toBe(52500)
    expect(check.balanceAfter).toBe(47500)
  })

  it("is not ready, without complaining, before anything is typed", () => {
    expect(checkAmount({ ...base, amountKobo: 0 })).toMatchObject({
      ready: false,
      problem: null,
    })
  })

  it("flags too little and too much", () => {
    expect(checkAmount({ ...base, amountKobo: 500 }).problem).toBe("below_min")
    expect(
      checkAmount({ ...base, mode: "topup", maxKobo: 40000 }).problem
    ).toBe("above_max")
  })

  it("counts the fee against the balance", () => {
    const check = checkAmount({ ...base, amountKobo: 99000 })
    expect(check.problem).toBe("insufficient")
    expect(check.shortfall).toBe(1500)
  })

  it("only charges a fee, and only checks the balance, on a send", () => {
    const request = checkAmount({
      ...base,
      mode: "request",
      amountKobo: 500000,
    })
    expect(request).toMatchObject({ ready: true, fee: 0, balanceAfter: null })
  })

  it("flags going over the day's limit", () => {
    expect(checkAmount({ ...base, leftToday: 20000 }).problem).toBe(
      "over_limit"
    )
  })
})

describe("limitRail", () => {
  it("picks the rail a move counts against", () => {
    expect(limitRail("topup", false)).toBe("deposit")
    expect(limitRail("request", true)).toBeNull()
    expect(limitRail("send", true)).toBe("bank_send")
    expect(limitRail("send", false)).toBe("send")
  })
})

describe("leftToday", () => {
  const limits: WalletLimits = {
    tier: "basic",
    send: { limit: 100, used: 30 },
    bank_send: { limit: 50, used: 80 },
    deposit: { limit: 10, used: 0 },
  }

  it("is what the rail still allows, never below zero", () => {
    expect(leftToday(limits, "send")).toBe(70)
    expect(leftToday(limits, "bank_send")).toBe(0)
  })

  it("is unknown without limits or a rail", () => {
    expect(leftToday(undefined, "send")).toBeNull()
    expect(leftToday(limits, null)).toBeNull()
  })
})

describe("sendsToBank", () => {
  it("is a send to a typed account number or a saved bank", () => {
    expect(sendsToBank("send", true, null)).toBe(true)
    expect(
      sendsToBank("send", false, {
        kind: "bank",
        bankName: "GTBank",
        accountName: "Ada",
        accountLast4: "1234",
        source: { recipientId: "r1" },
      })
    ).toBe(true)
    expect(sendsToBank("request", true, null)).toBe(false)
  })
})

describe("amountHint", () => {
  it("says what is wrong first", () => {
    const rules = { ...base, amountKobo: 500 }
    expect(amountHint(rules, checkAmount(rules))).toBe("Sends start at ₦100.")
  })

  it("names the fee when it is what tips the balance over", () => {
    const rules = { ...base, amountKobo: 99000 }
    expect(amountHint(rules, checkAmount(rules))).toContain("₦25 bank fee")
  })

  it("says what is left of the day's limit", () => {
    const rules = { ...base, leftToday: 20000 }
    expect(amountHint(rules, checkAmount(rules))).toBe(
      "That is over your daily limit. ₦200 left today."
    )
  })

  it("otherwise gives the useful context for the mode", () => {
    expect(amountHint(base, checkAmount(base))).toBe("You have ₦1,000.")
    const request = { ...base, mode: "request" as const }
    expect(amountHint(request, checkAmount(request))).toBe(
      "Nothing moves until they pay."
    )
    const topup = { ...base, mode: "topup" as const, maxKobo: 5_000_000 }
    expect(amountHint(topup, checkAmount(topup))).toBe("From ₦100 to ₦50,000.")
  })
})

describe("topUpFor", () => {
  it("covers the shortfall but never goes under the smallest top-up", () => {
    expect(topUpFor(500, 10000)).toBe(10000)
    expect(topUpFor(25000, 10000)).toBe(25000)
  })
})

describe("amountFix", () => {
  it("offers a top-up that covers a shortfall", () => {
    const check = checkAmount({ ...base, amountKobo: 99000 })
    expect(amountFix(check, 10000)).toEqual({
      kind: "topup",
      label: "Add ₦100 to cover it",
      amountKobo: 10000,
    })
  })

  it("points at the limits when over them", () => {
    const check = checkAmount({ ...base, leftToday: 0 })
    expect(amountFix(check, 10000)).toEqual({
      kind: "limits",
      label: "See your limits",
    })
  })

  it("offers nothing when all is well", () => {
    expect(amountFix(checkAmount(base), 10000)).toBeNull()
  })
})

describe("requestShortfall", () => {
  it("is what the balance lacks, or null", () => {
    expect(requestShortfall(5000, 2000)).toBe(3000)
    expect(requestShortfall(2000, 2000)).toBeNull()
  })
})
