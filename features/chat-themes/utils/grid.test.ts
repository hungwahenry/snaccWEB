import { describe, expect, it } from "vitest"
import { tileWidth } from "./grid"

describe("tileWidth", () => {
  it("splits the row into equal tiles after the gaps, never overflowing", () => {
    expect(tileWidth(336, 3, 12)).toBe(104)
    expect(tileWidth(335, 3, 12)).toBe(103)
  })

  it("waits for a measured width", () => {
    expect(tileWidth(0, 3, 12)).toBe(0)
  })
})
