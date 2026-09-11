import { describe, expect, it } from "vitest"
import { parseWholeNumber } from "./number"

describe("parseWholeNumber", () => {
  it("reads whole numbers, trimming space", () => {
    expect(parseWholeNumber("12")).toBe(12)
    expect(parseWholeNumber(" 0 ")).toBe(0)
    expect(parseWholeNumber("-3")).toBe(-3)
  })

  it("refuses blanks, decimals and words", () => {
    expect(parseWholeNumber("")).toBeNull()
    expect(parseWholeNumber("1.5")).toBeNull()
    expect(parseWholeNumber("ten")).toBeNull()
    expect(parseWholeNumber("1e3")).toBeNull()
  })

  it("keeps to the range it is given", () => {
    expect(parseWholeNumber("1001", { min: 0, max: 1000 })).toBeNull()
    expect(parseWholeNumber("-1", { min: 0 })).toBeNull()
    expect(parseWholeNumber("1000", { min: 0, max: 1000 })).toBe(1000)
  })
})
