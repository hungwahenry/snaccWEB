import { describe, expect, it } from "vitest"
import { money } from "@/lib/money"
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

const naira = (amount: number) => money(amount, "NGN")

const base: AmountRules = {
  mode: "send",
  amount: naira(50000),
  min: naira(10000),
  max: naira(1_000_000_000),
  fee: naira(2500),
  balance: naira(100000),
  leftToday: null,
}

describe("checkAmount", () => {
  it("is ready for an amount within every rule", () => {
    const check = checkAmount(base)
    expect(check).toMatchObject({
      ready: true,
      problem: null,
      fee: naira(2500),
    })
    expect(check.total).toEqual(naira(52500))
    expect(check.balanceAfter).toEqual(naira(47500))
  })

  it("is not ready, without complaining, before anything is typed", () => {
    expect(checkAmount({ ...base, amount: naira(0) })).toMatchObject({
      ready: false,
      problem: null,
    })
  })

  it("flags too little and too much", () => {
    expect(checkAmount({ ...base, amount: naira(500) }).problem).toBe(
      "below_min"
    )
    expect(
      checkAmount({ ...base, mode: "topup", max: naira(40000) }).problem
    ).toBe("above_max")
  })

  it("counts the fee against the balance", () => {
    const check = checkAmount({ ...base, amount: naira(99000) })
    expect(check.problem).toBe("insufficient")
    expect(check.shortfall).toEqual(naira(1500))
  })

  it("only charges a fee, and only checks the balance, on a send", () => {
    const request = checkAmount({
      ...base,
      mode: "request",
      amount: naira(500000),
    })
    expect(request).toMatchObject({
      ready: true,
      fee: naira(0),
      balanceAfter: null,
    })
  })

  it("flags going over the day's limit", () => {
    expect(checkAmount({ ...base, leftToday: naira(20000) }).problem).toBe(
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
    send: { limit: naira(100), used: naira(30) },
    bank_send: { limit: naira(50), used: naira(80) },
    deposit: { limit: naira(10), used: naira(0) },
  }

  it("is what the rail still allows, never below zero", () => {
    expect(leftToday(limits, "send")).toEqual(naira(70))
    expect(leftToday(limits, "bank_send")).toEqual(naira(0))
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
    const rules = { ...base, amount: naira(500) }
    expect(amountHint(rules, checkAmount(rules))).toBe("Sends start at ₦100.")
  })

  it("names the fee when it is what tips the balance over", () => {
    const rules = { ...base, amount: naira(99000) }
    expect(amountHint(rules, checkAmount(rules))).toContain("₦25 bank fee")
  })

  it("says what is left of the day's limit", () => {
    const rules = { ...base, leftToday: naira(20000) }
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
    const topup = { ...base, mode: "topup" as const, max: naira(5_000_000) }
    expect(amountHint(topup, checkAmount(topup))).toBe("From ₦100 to ₦50,000.")
  })
})

describe("topUpFor", () => {
  it("covers the shortfall but never goes under the smallest top-up", () => {
    expect(topUpFor(naira(500), naira(10000))).toEqual(naira(10000))
    expect(topUpFor(naira(25000), naira(10000))).toEqual(naira(25000))
  })
})

describe("amountFix", () => {
  it("offers a top-up that covers a shortfall", () => {
    const check = checkAmount({ ...base, amount: naira(99000) })
    expect(amountFix(check, naira(10000))).toEqual({
      kind: "topup",
      label: "Add ₦100 to cover it",
      amount: naira(10000),
    })
  })

  it("points at the limits when over them", () => {
    const check = checkAmount({ ...base, leftToday: naira(0) })
    expect(amountFix(check, naira(10000))).toEqual({
      kind: "limits",
      label: "See your limits",
    })
  })

  it("offers nothing when all is well", () => {
    expect(amountFix(checkAmount(base), naira(10000))).toBeNull()
  })
})

describe("requestShortfall", () => {
  it("is what the balance lacks, or null", () => {
    expect(requestShortfall(naira(5000), naira(2000))).toEqual(naira(3000))
    expect(requestShortfall(naira(2000), naira(2000))).toBeNull()
  })
})
