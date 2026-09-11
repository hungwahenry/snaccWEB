import { describe, expect, it } from "vitest"
import { barCount, barLit, trail, WAVE_WIDTH } from "./wave"

describe("barCount", () => {
  it("fits 3px bars with 3px gaps", () => {
    expect(barCount(3)).toBe(1)
    expect(barCount(9)).toBe(2)
    expect(barCount(WAVE_WIDTH)).toBe(22)
  })

  it("always draws at least one bar", () => {
    expect(barCount(0)).toBe(1)
    expect(barCount(-40)).toBe(1)
  })
})

describe("trail", () => {
  it("pads quiet bars on the left until the take fills the row", () => {
    expect(trail([0.5, 0.7], 4)).toEqual([0, 0, 0.5, 0.7])
  })

  it("keeps only the newest levels once the row is full", () => {
    expect(trail([0.1, 0.2, 0.3, 0.4], 2)).toEqual([0.3, 0.4])
  })

  it("is empty before the row has been measured", () => {
    expect(trail([0.1], 0)).toEqual([])
  })
})

describe("barLit", () => {
  it("lights the bars the play head has passed", () => {
    expect(barLit(0.5, 0, 4)).toBe(true)
    expect(barLit(0.5, 1, 4)).toBe(true)
    expect(barLit(0.5, 2, 4)).toBe(false)
    expect(barLit(1, 3, 4)).toBe(true)
    expect(barLit(0, 0, 4)).toBe(false)
  })
})
