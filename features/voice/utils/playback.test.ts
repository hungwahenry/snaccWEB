import { describe, expect, it, vi } from "vitest"
import {
  claimPlayback,
  fractionAt,
  mediaDurationMs,
  nextSpeed,
  playedFraction,
  releasePlayback,
  seekByKey,
  shownElapsed,
} from "./playback"

describe("claimPlayback", () => {
  it("pauses the note that was playing when another starts", () => {
    const first = { pause: vi.fn() }
    const second = { pause: vi.fn() }

    claimPlayback(first)
    claimPlayback(second)

    expect(first.pause).toHaveBeenCalledOnce()
    expect(second.pause).not.toHaveBeenCalled()
    releasePlayback(second)
  })

  it("doesn't pause a note that claims again", () => {
    const note = { pause: vi.fn() }

    claimPlayback(note)
    claimPlayback(note)

    expect(note.pause).not.toHaveBeenCalled()
    releasePlayback(note)
  })

  it("forgets a released note", () => {
    const first = { pause: vi.fn() }
    const second = { pause: vi.fn() }

    claimPlayback(first)
    releasePlayback(first)
    claimPlayback(second)

    expect(first.pause).not.toHaveBeenCalled()
    releasePlayback(second)
  })

  it("ignores a release from a note that no longer holds playback", () => {
    const first = { pause: vi.fn() }
    const second = { pause: vi.fn() }
    const third = { pause: vi.fn() }

    claimPlayback(first)
    claimPlayback(second)
    releasePlayback(first)
    claimPlayback(third)

    expect(second.pause).toHaveBeenCalledOnce()
    releasePlayback(third)
  })
})

describe("nextSpeed", () => {
  it("cycles 1x → 1.5x → 2x → 1x", () => {
    expect(nextSpeed(1)).toBe(1.5)
    expect(nextSpeed(1.5)).toBe(2)
    expect(nextSpeed(2)).toBe(1)
  })
})

describe("shownElapsed", () => {
  const base = { scrub: null, playing: false, elapsedMs: 0, totalMs: 10_000 }

  it("shows the full length before anything has played", () => {
    expect(shownElapsed(base)).toBe(10_000)
  })

  it("follows the play head once playing or paused part way", () => {
    expect(shownElapsed({ ...base, playing: true })).toBe(0)
    expect(shownElapsed({ ...base, elapsedMs: 4_000 })).toBe(4_000)
  })

  it("follows the finger while scrubbing", () => {
    expect(shownElapsed({ ...base, scrub: 0.25, elapsedMs: 9_000 })).toBe(2_500)
  })
})

describe("playedFraction", () => {
  it("is the share of the note played, capped at 1", () => {
    expect(playedFraction(2_500, 10_000)).toBe(0.25)
    expect(playedFraction(12_000, 10_000)).toBe(1)
  })

  it("is 0 when the length is unknown", () => {
    expect(playedFraction(2_000, 0)).toBe(0)
  })
})

describe("mediaDurationMs", () => {
  it("uses the element's length when it knows it", () => {
    expect(mediaDurationMs(12.5, 9_000)).toBe(12_500)
  })

  it("falls back when the element reports Infinity, NaN or 0", () => {
    expect(mediaDurationMs(Infinity, 9_000)).toBe(9_000)
    expect(mediaDurationMs(Number.NaN, 9_000)).toBe(9_000)
    expect(mediaDurationMs(0, 9_000)).toBe(9_000)
  })
})

describe("fractionAt", () => {
  const rect = { left: 100, width: 200 }

  it("maps a pointer across the element to 0–1", () => {
    expect(fractionAt(100, rect)).toBe(0)
    expect(fractionAt(200, rect)).toBe(0.5)
    expect(fractionAt(300, rect)).toBe(1)
  })

  it("clamps outside the element", () => {
    expect(fractionAt(50, rect)).toBe(0)
    expect(fractionAt(400, rect)).toBe(1)
  })

  it("is 0 for an element with no width", () => {
    expect(fractionAt(120, { left: 100, width: 0 })).toBe(0)
  })
})

describe("seekByKey", () => {
  it("steps with the arrow keys", () => {
    expect(seekByKey("ArrowRight", 0.5)).toBeCloseTo(0.55)
    expect(seekByKey("ArrowUp", 0.5)).toBeCloseTo(0.55)
    expect(seekByKey("ArrowLeft", 0.5)).toBeCloseTo(0.45)
    expect(seekByKey("ArrowDown", 0.5)).toBeCloseTo(0.45)
  })

  it("stays within the note", () => {
    expect(seekByKey("ArrowRight", 0.98)).toBe(1)
    expect(seekByKey("ArrowLeft", 0.02)).toBe(0)
  })

  it("jumps to the ends with Home and End", () => {
    expect(seekByKey("Home", 0.5)).toBe(0)
    expect(seekByKey("End", 0.5)).toBe(1)
  })

  it("leaves other keys alone", () => {
    expect(seekByKey("Enter", 0.5)).toBeNull()
  })
})
