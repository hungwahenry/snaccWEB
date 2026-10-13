import { describe, expect, it } from "vitest"
import { isSeen, VISIBILITY_STEPS } from "./visible"

describe("isSeen", () => {
  it("counts a card once most of it is on screen", () => {
    expect(isSeen({ ratio: 0.6, height: 120, screen: 1000 })).toBe(true)
    expect(isSeen({ ratio: 0.55, height: 110, screen: 1000 })).toBe(false)
  })

  it("counts a card too tall to fit once it fills half the screen", () => {
    expect(isSeen({ ratio: 0.3, height: 600, screen: 1000 })).toBe(true)
    expect(isSeen({ ratio: 0.2, height: 400, screen: 1000 })).toBe(false)
  })

  it("goes by the card alone when the screen size is unknown", () => {
    expect(isSeen({ ratio: 0.3, height: 600, screen: null })).toBe(false)
  })
})

describe("VISIBILITY_STEPS", () => {
  it("reports every five percent, so a tall card is noticed as it scrolls", () => {
    expect(VISIBILITY_STEPS).toHaveLength(21)
    expect(VISIBILITY_STEPS[0]).toBe(0)
    expect(VISIBILITY_STEPS[20]).toBe(1)
  })
})
