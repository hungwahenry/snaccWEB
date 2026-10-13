import { describe, expect, it } from "vitest"
import { countryOfWhere, DEFAULT_SET, whereLabel, whereOptions } from "./where"

describe("where", () => {
  it("names the country, or says the default set covers everywhere else", () => {
    const countries = new Map([["GH", "Ghana"]])
    expect(whereLabel("GH", countries)).toBe("Ghana")
    expect(whereLabel(null, countries)).toBe(
      "Default, everywhere without its own"
    )
  })

  it("offers the default set first, and reads it back as no country", () => {
    const options = whereOptions([{ value: "GH", label: "Ghana" }])
    expect(options.map((option) => option.value)).toEqual([DEFAULT_SET, "GH"])
    expect(countryOfWhere(DEFAULT_SET)).toBeNull()
    expect(countryOfWhere("GH")).toBe("GH")
  })
})
