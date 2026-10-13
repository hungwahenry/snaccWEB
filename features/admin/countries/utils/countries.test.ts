import { describe, expect, it } from "vitest"
import type { AdminCountry } from "../types"
import { filterCountries, isMinAge, openMessage } from "./countries"

const country = (code: string, name: string, open = false): AdminCountry => ({
  code,
  name,
  currency: "XXX",
  open,
  min_age: 13,
  campuses: 0,
})

const ALL = [
  country("GH", "Ghana"),
  country("KE", "Kenya"),
  country("GB", "United Kingdom"),
]

describe("filterCountries", () => {
  it("finds countries by name or exact code", () => {
    expect(filterCountries(ALL, "ken").map((row) => row.code)).toEqual(["KE"])
    expect(filterCountries(ALL, "gb").map((row) => row.code)).toEqual(["GB"])
    expect(filterCountries(ALL, "  ")).toHaveLength(3)
  })
})

describe("openMessage", () => {
  it("says what opening or closing means for people there", () => {
    expect(openMessage(country("GH", "Ghana", true))).toBe(
      "Ghana is open. Anyone waiting there gets an email."
    )
    expect(openMessage(country("GH", "Ghana"))).toBe(
      "Ghana is closed. People there wait until it opens again."
    )
  })
})

describe("isMinAge", () => {
  it("takes a whole number of years up to 30", () => {
    expect(isMinAge("16")).toBe(true)
    expect(isMinAge("")).toBe(false)
    expect(isMinAge("13.5")).toBe(false)
    expect(isMinAge("31")).toBe(false)
  })
})
