import { describe, expect, it } from "vitest"
import { aspectRatio } from "./aspect"

describe("aspectRatio", () => {
  it("divides width by height and treats a missing size as square", () => {
    expect(aspectRatio({ width: 1600, height: 900 })).toBeCloseTo(16 / 9)
    expect(aspectRatio({ width: 0, height: 900 })).toBe(1)
  })
})
