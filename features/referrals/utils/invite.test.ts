import { describe, expect, it } from "vitest"
import {
  inviteMessage,
  isCompleteInviteCode,
  normalizeInviteCode,
  rewardBlurb,
} from "./invite"
import { money } from "@/lib/money"

const naira = (amount: number) => money(amount, "NGN")

describe("normalizeInviteCode", () => {
  it("uppercases and drops spaces and dashes", () => {
    expect(normalizeInviteCode(" k7pq-2mx9 ")).toBe("K7PQ2MX9")
  })

  it("never grows past the longest code", () => {
    expect(normalizeInviteCode("abcdefghijklmnop")).toHaveLength(12)
  })
})

describe("isCompleteInviteCode", () => {
  it("needs a few characters before it is worth sending", () => {
    expect(isCompleteInviteCode("K7P")).toBe(false)
    expect(isCompleteInviteCode("K7PQ")).toBe(true)
  })
})

describe("inviteMessage", () => {
  it("carries the code", () => {
    expect(inviteMessage("K7PQ2MX9")).toContain("K7PQ2MX9")
  })
})

describe("rewardBlurb", () => {
  it("names both rewards and the score", () => {
    expect(
      rewardBlurb(
        { referrer: naira(10000), referee: naira(5000), score: 10 },
        7
      )
    ).toBe(
      "Every friend who joins with your code and uses Snacc for a week gets you ₦100 and 10 Snacc Score. They can get a welcome reward too."
    )
  })

  it("leaves the score out when there is none", () => {
    expect(
      rewardBlurb({ referrer: naira(10000), referee: naira(5000), score: 0 }, 7)
    ).toContain("gets you ₦100. They can")
  })

  it("follows the qualifying period the server sets", () => {
    expect(
      rewardBlurb(
        { referrer: naira(10000), referee: naira(5000), score: 0 },
        14
      )
    ).toContain("for 14 days")
  })
})
