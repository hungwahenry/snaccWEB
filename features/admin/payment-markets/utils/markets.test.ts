import { describe, expect, it } from "vitest"
import type { AdminPaymentMarket } from "../types"
import { draftFrom, idLine, methodsLine, parseDraft, toggled } from "./markets"

const market: AdminPaymentMarket = {
  country_code: "XT",
  country: "Testland",
  currency: "XTS",
  provider_key: "paystack",
  provider: "Paystack",
  deposit_methods: ["bank_transfer"],
  payout_methods: ["bank_account"],
  account_number_length: 8,
  id_name: null,
  id_length: null,
  provider_settings: { country: "testland" },
  updated_at: "2026-10-13T00:00:00.000Z",
}

describe("parseDraft", () => {
  it("turns a market back into what it was saved from", () => {
    expect(parseDraft(draftFrom(market))).toEqual({
      ok: true,
      country: "XT",
      input: {
        providerKey: "paystack",
        depositMethods: ["bank_transfer"],
        payoutMethods: ["bank_account"],
        accountNumberLength: 8,
        idName: null,
        idLength: null,
        providerSettings: { country: "testland" },
      },
    })
  })

  it("waits for a country and provider before saying anything", () => {
    expect(parseDraft(draftFrom())).toEqual({ ok: false, message: null })
  })

  it("says what is wrong with the rest", () => {
    const draft = draftFrom(market)
    expect(parseDraft({ ...draft, accountNumberLength: "2" })).toMatchObject({
      ok: false,
    })
    expect(parseDraft({ ...draft, idName: "Tax number" })).toEqual({
      ok: false,
      message: "Give the ID a name and a length from 4 to 30, or neither.",
    })
    expect(parseDraft({ ...draft, settings: "[]" })).toEqual({
      ok: false,
      message: "Provider settings must be a JSON object.",
    })
    expect(
      parseDraft({ ...draft, idName: " Tax number ", idLength: "6" })
    ).toMatchObject({ ok: true, input: { idName: "Tax number", idLength: 6 } })
  })
})

describe("lines", () => {
  it("lists what a market does and the ID it checks", () => {
    expect(methodsLine(market)).toBe(
      "Top-ups by bank transfer · Sends to bank accounts"
    )
    expect(
      methodsLine({ ...market, deposit_methods: [], payout_methods: [] })
    ).toBe("Nothing yet")
    expect(idLine(market)).toBe("None asked")
    expect(idLine({ ...market, id_name: "Tax number", id_length: 6 })).toBe(
      "Tax number, 6 digits"
    )
  })
})

describe("toggled", () => {
  it("adds once and removes cleanly", () => {
    expect(toggled(["a"], "a", true)).toEqual(["a"])
    expect(toggled(["a"], "b", true)).toEqual(["a", "b"])
    expect(toggled(["a", "b"], "a", false)).toEqual(["b"])
  })
})
