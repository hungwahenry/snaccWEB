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
import { money } from "@/lib/money"

const naira = (amount: number) => money(amount, "NGN")

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
  type: "like",
  amount: naira(500),
  snacc_id: "s1",
  beneficiary: party(),
  actor: party({ id: "u2", username: "tunde" }),
  created_at: "2026-09-01T00:00:00Z",
  ...patch,
})

const fund: AdminFund = {
  university_id: "uni1",
  university: { id: "uni1", name: "Lagos", slug: "unilag", acronym: "UNILAG" },
  cap: naira(250_050),
  distributed: naira(1_000),
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
  it("names who caused it, with a dash once their account is gone", () => {
    expect(earningCause(earning())).toBe("@tunde")
    expect(earningCause(earning({ actor: null }))).toBe("—")
  })
})

describe("earningLabel", () => {
  it("names an earning by the act that paid it, even once that act is retired", () => {
    expect(earningLabel(earning())).toBe("like")
    expect(earningLabel(earning({ type: null }))).toBe("retired")
  })
})

describe("options", () => {
  it("offers every engagement kind as a type", () => {
    expect(kindOptions([{ key: "like", label: "Like" }])).toEqual([
      { value: "like", label: "Like" },
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
    expect(toFundInput({ universityId: "", cap: "500" }, "NGN")).toBeNull()
    expect(toFundInput({ universityId: "uni1", cap: "abc" }, "NGN")).toBeNull()
    expect(toFundInput({ universityId: "uni1", cap: "500" }, null)).toBeNull()
    expect(
      toFundInput({ universityId: "uni1", cap: "1,500.5" }, "NGN")
    ).toEqual({
      universityId: "uni1",
      cap: naira(150_050),
    })
  })

  it("only complains once something has been typed", () => {
    expect(capProblem("", "NGN")).toBeNull()
    expect(capProblem("5000", "NGN")).toBeNull()
    expect(capProblem("-5", "NGN")).toBe(CAP_INVALID)
  })
})
