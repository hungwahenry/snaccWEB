import { describe, expect, it } from "vitest"
import type { SnaccHangout } from "../types"
import {
  goingLine,
  hangoutTitle,
  isOngoing,
  placeLine,
  stateAt,
  whenLine,
  whenLineFor,
} from "./hangouts"

const NOW = new Date(2026, 9, 3, 12, 0).getTime()
const at = (hours: number) => new Date(NOW + hours * 3_600_000).toISOString()

const hangout = (patch: Partial<SnaccHangout> = {}): SnaccHangout => ({
  title: "watch the derby",
  emoji: "⚽",
  place: "SUB common room",
  starts_at: at(6),
  joinable_until: at(6.5),
  wraps_at: at(30),
  capacity: 6,
  going_count: 2,
  full: false,
  private: false,
  state: "upcoming",
  join_state: "none",
  requests_count: null,
  university_id: "ui",
  ...patch,
})

describe("stateAt", () => {
  it("reads the clock rather than trusting a state that may be stale", () => {
    expect(stateAt(hangout(), NOW)).toBe("upcoming")
    expect(stateAt(hangout({ starts_at: at(-1) }), NOW)).toBe("happening")
    expect(
      stateAt(hangout({ starts_at: at(-30), wraps_at: at(-6) }), NOW)
    ).toBe("over")
    expect(stateAt(hangout({ state: "cancelled" }), NOW)).toBe("cancelled")
  })

  it("counts a hangout as on until it is over or called off", () => {
    expect(isOngoing(hangout({ starts_at: at(-1) }), NOW)).toBe(true)
    expect(isOngoing(hangout({ state: "cancelled" }), NOW)).toBe(false)
  })
})

describe("labels", () => {
  it("labels a state the server already worked out", () => {
    expect(whenLineFor("over", at(-30))).toBe("Over · Fri 2 Oct")
    expect(whenLineFor("upcoming", at(6))).toBe("Sat 3 Oct at 6:00 PM")
  })

  it("says when, or that it is on now, over or called off", () => {
    expect(whenLine(hangout(), NOW)).toBe("Sat 3 Oct at 6:00 PM")
    expect(whenLine(hangout({ starts_at: at(-1) }), NOW)).toBe("Happening now")
    expect(whenLine(hangout({ state: "cancelled" }), NOW)).toBe(
      "Called off · Sat 3 Oct"
    )
  })

  it("names it, counts the host among the people going, and keeps a private place back", () => {
    expect(hangoutTitle(hangout())).toBe("⚽ watch the derby")
    expect(goingLine(hangout())).toBe("2 of 6 going")
    expect(placeLine(hangout({ place: null }))).toBe("Shown to people going")
  })
})
