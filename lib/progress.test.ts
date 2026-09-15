import { describe, expect, it } from "vitest"
import { progressPercent, ringOffset } from "./progress"

describe("progressPercent", () => {
  it("rounds to a whole percent and stays between 0 and 100", () => {
    expect(progressPercent(0.426)).toBe(43)
    expect(progressPercent(1.4)).toBe(100)
    expect(progressPercent(-0.2)).toBe(0)
  })
})

describe("ringOffset", () => {
  it("hides the whole ring at the start and none of it at the end", () => {
    expect(ringOffset(0, 100)).toBe(100)
    expect(ringOffset(1, 100)).toBe(0)
    expect(ringOffset(0.25, 100)).toBe(75)
  })
})
