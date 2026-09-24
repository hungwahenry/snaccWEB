import { describe, expect, it } from "vitest"
import {
  inviteCodeSettled,
  inviteCodeStatus,
  inviteMessage,
  isCompleteInviteCode,
  normalizeInviteCode,
  rewardBlurb,
} from "./invite"

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

describe("inviteCodeStatus", () => {
  const quiet = { checking: false, found: false, missing: false }

  it("is idle while empty and typing until the code settles", () => {
    expect(inviteCodeStatus({ typed: "", settled: "", ...quiet })).toBe("idle")
    expect(inviteCodeStatus({ typed: "K7P", settled: "K7P", ...quiet })).toBe(
      "typing"
    )
    expect(
      inviteCodeStatus({ typed: "K7PQ2MX9", settled: "K7PQ", ...quiet })
    ).toBe("typing")
  })

  it("checks a settled code, then says whether it exists", () => {
    const settled = { typed: "K7PQ2MX9", settled: "K7PQ2MX9" }
    expect(inviteCodeStatus({ ...settled, ...quiet })).toBe("checking")
    expect(inviteCodeStatus({ ...settled, ...quiet, found: true })).toBe(
      "valid"
    )
    expect(inviteCodeStatus({ ...settled, ...quiet, missing: true })).toBe(
      "invalid"
    )
  })

  it("only lets onboarding finish with no code or a real one", () => {
    expect(inviteCodeSettled("idle")).toBe(true)
    expect(inviteCodeSettled("valid")).toBe(true)
    expect(inviteCodeSettled("typing")).toBe(false)
    expect(inviteCodeSettled("invalid")).toBe(false)
  })
})

describe("rewardBlurb", () => {
  it("names both rewards and the score", () => {
    expect(
      rewardBlurb({ referrer_kobo: 10000, referee_kobo: 5000, score: 10 }, 7)
    ).toBe(
      "Every friend who joins with your code and uses Snacc for a week gets you ₦100 and 10 Snacc Score. They get ₦50 too."
    )
  })

  it("leaves the score out when there is none", () => {
    expect(
      rewardBlurb({ referrer_kobo: 10000, referee_kobo: 5000, score: 0 }, 7)
    ).toContain("gets you ₦100. They get")
  })

  it("follows the qualifying period the server sets", () => {
    expect(
      rewardBlurb({ referrer_kobo: 10000, referee_kobo: 5000, score: 0 }, 14)
    ).toContain("for 14 days")
  })
})
