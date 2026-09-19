import { describe, expect, it } from "vitest"
import { allowsAutoplay, autoplayTarget, shareOf } from "./autoplay"

describe("allowsAutoplay", () => {
  const on = { flag: true, reducedMotion: false, savesData: false }

  it("plays previews when nothing says not to", () => {
    expect(allowsAutoplay(on)).toBe(true)
  })

  it("stays still when switched off, or when the person asked for less", () => {
    expect(allowsAutoplay({ ...on, flag: false })).toBe(false)
    expect(allowsAutoplay({ ...on, reducedMotion: true })).toBe(false)
    expect(allowsAutoplay({ ...on, savesData: true })).toBe(false)
  })
})

describe("autoplayTarget", () => {
  it("plays the highest clip that is properly on screen", () => {
    expect(
      autoplayTarget([
        { card: "low", top: 700, share: 1 },
        { card: "high", top: 120, share: 0.8 },
      ])
    ).toBe("high")
  })

  it("skips a clip that is only peeking in", () => {
    expect(
      autoplayTarget([
        { card: "peeking", top: -300, share: 0.3 },
        { card: "whole", top: 250, share: 1 },
      ])
    ).toBe("whole")
  })

  it("plays nothing when no clip is on screen enough", () => {
    expect(autoplayTarget([{ card: "a", top: 0, share: 0.2 }])).toBeNull()
    expect(autoplayTarget([])).toBeNull()
  })
})

describe("shareOf", () => {
  it("counts how much of the clip is showing", () => {
    expect(shareOf(0.7, 300, 900)).toBe(0.7)
  })

  it("counts a clip taller than the window by how much of the window it fills", () => {
    expect(shareOf(0.5, 720, 800)).toBe(0.9)
    expect(shareOf(0.5, 720, 0)).toBe(0.5)
  })
})
