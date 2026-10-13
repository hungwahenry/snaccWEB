import { describe, expect, it } from "vitest"
import type { AdminAd } from "../types"
import {
  EMPTY_REJECTION,
  moneyFacts,
  personNote,
  reviewFacts,
  toRejectInput,
} from "./ads"
import { money } from "@/lib/money"

const person = {
  id: "u1",
  username: "bola",
  display_name: "Bola",
  campus: "UNILAG",
}

const naira = (amount: number) => money(amount, "NGN")

const spend = {
  budget: naira(500_000),
  spent: naira(120_000),
  views_count: 2400,
  clicks_count: 31,
  reach: 1200,
  settled_at: null,
}

const review: Parameters<typeof reviewFacts>[0] = {
  created_at: "2026-10-01T09:00:00Z",
  reviewed_at: null,
  reviewed_by: null,
  rejection: null,
  end_reason: null,
  ended_at: null,
  settled_at: null,
}

describe("personNote", () => {
  it("shows the handle and the campus", () => {
    expect(personNote(person)).toBe("@bola · UNILAG")
    expect(personNote({ ...person, campus: null })).toBe("@bola")
  })
})

describe("moneyFacts", () => {
  it("shows what is left while it runs", () => {
    expect(moneyFacts(spend)).toEqual([
      { label: "Budget", value: "₦5,000" },
      { label: "Spent", value: "₦1,200" },
      { label: "Left to spend", value: "₦3,800" },
      { label: "Views", value: "2,400" },
      { label: "Clicks", value: "31" },
      { label: "Matched when sent", value: "1,200 people" },
    ])
  })

  it("calls the rest sent back once it has settled", () => {
    expect(
      moneyFacts({ ...spend, settled_at: "2026-10-05T00:00:00Z" })[2]
    ).toEqual({ label: "Sent back to them", value: "₦3,800" })
  })
})

describe("reviewFacts", () => {
  const labels = (ad: Parameters<typeof reviewFacts>[0]) =>
    reviewFacts(ad).map((fact) => fact.label)

  it("shows a pending one as not reviewed or settled yet", () => {
    expect(reviewFacts(review).slice(1)).toEqual([
      { label: "Reviewed", value: "Not yet" },
      { label: "Money settled", value: "Not yet" },
    ])
  })

  it("names the reviewer, the reason and the note on a rejected one", () => {
    const rejected: AdminAd["rejection"] = {
      id: "r1",
      slug: "alcohol",
      label: "Alcohol",
      description: "We don't promote alcohol.",
      prohibited: true,
      note: "Try the mocktail instead.",
    }
    expect(
      reviewFacts({
        ...review,
        reviewed_at: "2026-10-02T09:00:00Z",
        reviewed_by: { ...person, username: "ada", display_name: "Ada" },
        rejection: rejected,
        settled_at: "2026-10-02T09:00:00Z",
      }).filter((fact) =>
        [
          "Reviewed by",
          "Rejected for",
          "They were told",
          "Note to them",
        ].includes(fact.label)
      )
    ).toEqual([
      { label: "Reviewed by", value: "Ada" },
      { label: "Rejected for", value: "Alcohol" },
      { label: "They were told", value: "We don't promote alcohol." },
      { label: "Note to them", value: "Try the mocktail instead." },
    ])
  })

  it("says why an ended one ended", () => {
    const ended = {
      ...review,
      end_reason: "spent" as const,
      ended_at: "2026-10-04T09:00:00Z",
    }
    expect(labels(ended)).toContain("Ended")
    expect(
      reviewFacts(ended).find((fact) => fact.label === "Why it ended")?.value
    ).toBe("Spent its budget")
    expect(labels(review)).not.toContain("Why it ended")
  })
})

describe("toRejectInput", () => {
  it("needs a reason and trims the note", () => {
    expect(toRejectInput(EMPTY_REJECTION)).toBeNull()
    expect(toRejectInput({ reasonId: "r1", note: "  too loud " })).toEqual({
      reasonId: "r1",
      note: "too loud",
    })
    expect(toRejectInput({ reasonId: "r1", note: "  " })).toEqual({
      reasonId: "r1",
      note: undefined,
    })
  })
})
