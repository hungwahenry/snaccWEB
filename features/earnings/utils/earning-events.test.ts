import { describe, expect, it } from "vitest"
import type { MoneyPerson } from "@/features/wallet/types"
import { earningLine } from "./earning-events"

const ada = { username: "ada" } as MoneyPerson

describe("earningLine", () => {
  it("names who did what", () => {
    expect(earningLine({ type: "reaction", actor: ada })).toEqual({
      who: "@ada",
      what: "reacted",
    })
    expect(earningLine({ type: "poll_vote", actor: ada })).toEqual({
      who: "@ada",
      what: "voted in your poll",
    })
  })

  it("speaks of someone when the account is gone", () => {
    expect(earningLine({ type: "resnacc", actor: null })).toEqual({
      who: null,
      what: "Someone resnacced",
    })
  })

  it("calls a bonus a bonus", () => {
    expect(earningLine({ type: "bonus", actor: null })).toEqual({
      who: null,
      what: "Bonus",
    })
  })

  it("copes with a kind it does not know yet", () => {
    expect(earningLine({ type: "share", actor: ada }).what).toBe("engaged")
    expect(earningLine({ type: null, actor: ada }).what).toBe("engaged")
  })
})
