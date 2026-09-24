import { describe, expect, it } from "vitest"
import { sparklinePaths } from "./sparkline"

describe("sparklinePaths", () => {
  it("draws the series across the width, high values up", () => {
    const paths = sparklinePaths([1, 3, 2], 100, 44, 2)

    expect(paths?.line).toBe("M0.0 42.0 L50.0 2.0 L100.0 22.0")
    expect(paths?.area).toBe("M0.0 42.0 L50.0 2.0 L100.0 22.0 L100 44 L0 44 Z")
  })

  it("keeps a flat series in the middle instead of dividing by zero", () => {
    expect(sparklinePaths([5, 5], 10, 10, 0)?.line).toBe("M0.0 10.0 L10.0 10.0")
  })

  it("needs at least two points and a box", () => {
    expect(sparklinePaths([1], 100, 44)).toBeNull()
    expect(sparklinePaths([1, 2], 0, 44)).toBeNull()
  })
})
