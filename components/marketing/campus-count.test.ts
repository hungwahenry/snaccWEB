import { describe, expect, it } from "vitest"
import { campusCountLabel } from "./campus-count"

describe("campusCountLabel", () => {
  it("rounds down to the nearest ten", () => {
    expect(campusCountLabel(143)).toBe("Students at 140+ campuses")
    expect(campusCountLabel(10)).toBe("Students at 10+ campuses")
  })

  it("falls back when the count is missing or too small to brag about", () => {
    expect(campusCountLabel(null)).toBe("Campuses across Nigeria")
    expect(campusCountLabel(0)).toBe("Campuses across Nigeria")
    expect(campusCountLabel(9)).toBe("Campuses across Nigeria")
  })
})
