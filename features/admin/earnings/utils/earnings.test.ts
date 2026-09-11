import { describe, expect, it } from "vitest"
import type { AdminEarning, AdminFund, EarningParty } from "../types"
import {
  CAP_INVALID,
  capProblem,
  earningCause,
  earningLabel,
  fundDraft,
  kindOptions,
  partyHandle,
  toFundInput,
  unfundedOptions,
} from "./earnings"

const party = (patch: Partial<EarningParty> = {}): EarningParty => ({
  id: "u1",
  username: "bola",
  display_name: "Bola",
  avatar_url: "",
  university: null,
  ...patch,
})

const earning = (patch: Partial<AdminEarning> = {}): AdminEarning => ({
  id: "e1",
  movement: "credit",
  type: "reaction",
  amount: 500,
  note: null,
  snacc_id: "s1",
  beneficiary: party(),
  actor: party({ id: "u2", username: "tunde" }),
  admin: null,
  created_at: "2026-09-01T00:00:00Z",
  ...patch,
})

const fund: AdminFund = {
  university_id: "uni1",
  university: { id: "uni1", name: "Lagos", slug: "unilag", acronym: "UNILAG" },
  cap: 250_050,
  distributed: 1_000,
  created_at: "2026-09-01T00:00:00Z",
}

describe("partyHandle", () => {
  it("prefers the handle, then the display name", () => {
    expect(partyHandle(party())).toBe("@bola")
    expect(partyHandle(party({ username: null }))).toBe("Bola")
    expect(partyHandle(party({ username: null, display_name: "" }))).toBe("—")
    expect(partyHandle(null)).toBeNull()
  })
})

describe("earningCause", () => {
  it("names the actor behind a credit", () => {
    expect(earningCause(earning())).toBe("@tunde")
  })

  it("says what a claim or an adjustment was", () => {
    expect(earningCause(earning({ movement: "claim", actor: null }))).toBe(
      "Claimed"
    )
    expect(
      earningCause(
        earning({
          movement: "adjustment",
          actor: null,
          admin: party({ username: "ada" }),
        })
      )
    ).toBe("Adjusted by @ada")
    expect(earningCause(earning({ movement: "adjustment", actor: null }))).toBe(
      "Adjusted"
    )
  })

  it("falls back to a dash for a credit whose actor is gone", () => {
    expect(earningCause(earning({ actor: null }))).toBe("—")
  })
})

describe("earningLabel", () => {
  it("names a credit by its type and the rest by their movement", () => {
    expect(earningLabel(earning())).toBe("reaction")
    expect(earningLabel(earning({ movement: "claim", type: null }))).toBe(
      "claim"
    )
  })
})

describe("options", () => {
  it("offers every engagement kind as a type", () => {
    expect(kindOptions([{ key: "reaction", label: "Reaction" }])).toEqual([
      { value: "reaction", label: "Reaction" },
    ])
  })

  it("offers only campuses without a fund", () => {
    expect(
      unfundedOptions(
        [
          { id: "uni1", name: "Lagos" },
          { id: "uni2", name: "Ibadan" },
        ],
        [{ university_id: "uni1" }]
      )
    ).toEqual([{ value: "uni2", label: "Ibadan" }])
  })
})

describe("fund drafts", () => {
  it("starts empty for a new fund and from the cap for an existing one", () => {
    expect(fundDraft()).toEqual({ universityId: "", cap: "" })
    expect(fundDraft(fund)).toEqual({ universityId: "uni1", cap: "2500.50" })
  })

  it("needs a campus and a real amount", () => {
    expect(toFundInput({ universityId: "", cap: "500" })).toBeNull()
    expect(toFundInput({ universityId: "uni1", cap: "abc" })).toBeNull()
    expect(toFundInput({ universityId: "uni1", cap: "1,500.5" })).toEqual({
      universityId: "uni1",
      cap: 150_050,
    })
  })

  it("only complains once something has been typed", () => {
    expect(capProblem("")).toBeNull()
    expect(capProblem("5000")).toBeNull()
    expect(capProblem("-5")).toBe(CAP_INVALID)
  })
})
