import { describe, expect, it } from "vitest"
import { filterBanks } from "./banks"

const banks = [
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "Wema Bank", code: "035" },
]

describe("filterBanks", () => {
  it("shows every bank before anything is typed", () => {
    expect(filterBanks(banks, "  ")).toEqual(banks)
  })

  it("matches words in any order and case", () => {
    expect(filterBanks(banks, "bank first").map((bank) => bank.code)).toEqual([
      "011",
    ])
    expect(filterBanks(banks, "WEMA").map((bank) => bank.code)).toEqual(["035"])
  })

  it("finds nothing for a name no bank has", () => {
    expect(filterBanks(banks, "kuda")).toEqual([])
  })
})
