import { describe, expect, it } from "vitest"
import {
  claimWindow,
  inviteMessage,
  inviteNote,
  isCompleteInviteCode,
  normalizeInviteCode,
  rewardBlurb,
  welcomeLine,
} from "./invite"
import { formatMoney, money } from "@/lib/money"

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

describe("welcomeLine", () => {
  const none = { referrer: naira(0), referee: naira(0), score: 0 }

  it("leads with the welcome reward when there is one", () => {
    expect(welcomeLine({ ...none, referee: naira(50000) }, 7)).toBe(
      `Enter their code and get ${formatMoney(naira(50000))} after a week on Snacc.`
    )
  })

  it("says the friend is rewarded when only they are", () => {
    expect(welcomeLine({ ...none, referrer: naira(50000) }, 7)).toBe(
      "Enter their code so they get rewarded for bringing you."
    )
    expect(welcomeLine({ ...none, score: 10 }, 7)).toBe(
      "Enter their code so they get rewarded for bringing you."
    )
  })

  it("still has something to say with no rewards at all", () => {
    expect(welcomeLine(none, 7)).toBe(
      "Enter their code so they know you made it."
    )
  })
})

describe("inviteNote", () => {
  const ada = { display_name: "Ada", username: "ada" }

  it("names the inviter by username once the code is found", () => {
    expect(inviteNote(ada, false, 7)).toEqual({
      text: "@ada invited you",
      tone: "found",
    })
    expect(
      inviteNote({ display_name: "Ada", username: null }, false, 7).text
    ).toBe("Ada invited you")
  })

  it("says when a code does not exist", () => {
    expect(inviteNote(null, true, 7)).toEqual({
      text: "That code doesn’t exist.",
      tone: "missing",
    })
  })

  it("otherwise says how long codes work", () => {
    expect(inviteNote(null, false, 7)).toEqual({
      text: claimWindow(7),
      tone: "quiet",
    })
    expect(claimWindow(7)).toBe("Codes work for 7 days after you join.")
  })
})
