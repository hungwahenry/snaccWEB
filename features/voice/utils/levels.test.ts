import { describe, expect, it } from "vitest"
import { decibelsOf, levelFromMetering, levelsFor } from "./levels"

describe("levelFromMetering", () => {
  it("keeps a floor for silence or no reading", () => {
    expect(levelFromMetering(undefined)).toBeCloseTo(0.12)
    expect(levelFromMetering(Number.NaN)).toBeCloseTo(0.12)
    expect(levelFromMetering(-Infinity)).toBeCloseTo(0.12)
    expect(levelFromMetering(-80)).toBeCloseTo(0.12)
  })

  it("reaches full height at 0 dB and clamps above it", () => {
    expect(levelFromMetering(0)).toBeCloseTo(1)
    expect(levelFromMetering(12)).toBeCloseTo(1)
  })

  it("rises with loudness", () => {
    expect(levelFromMetering(-20)).toBeGreaterThan(levelFromMetering(-40))
  })
})

describe("decibelsOf", () => {
  it("is -Infinity for silence and empty windows", () => {
    expect(decibelsOf([0, 0, 0])).toBe(-Infinity)
    expect(decibelsOf([])).toBe(-Infinity)
  })

  it("is 0 dB for a full-scale signal", () => {
    expect(decibelsOf([1, -1, 1, -1])).toBeCloseTo(0)
  })

  it("drops about 6 dB when the signal halves", () => {
    expect(decibelsOf([0.5, -0.5])).toBeCloseTo(-6.02, 1)
  })
})

describe("levelsFor", () => {
  it("draws the same bars for the same note", () => {
    expect(levelsFor("note-1", 20)).toEqual(levelsFor("note-1", 20))
  })

  it("draws different bars for different notes", () => {
    expect(levelsFor("note-1", 20)).not.toEqual(levelsFor("note-2", 20))
  })

  it("returns the asked number of levels, all within range", () => {
    const levels = levelsFor("abc", 33)
    expect(levels).toHaveLength(33)
    for (const level of levels) {
      expect(level).toBeGreaterThanOrEqual(0.12)
      expect(level).toBeLessThanOrEqual(1)
    }
  })
})
