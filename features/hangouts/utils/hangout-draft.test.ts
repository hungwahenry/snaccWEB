import { describe, expect, it } from "vitest"
import type { HangoutDraft, HangoutLimits, SnaccHangout } from "../types"
import {
  checkHangout,
  clampCapacity,
  freshHangout,
  fromHangout,
  hangoutChanged,
  hangoutPayload,
  timeProblem,
} from "./hangout-draft"

const NOW = Date.parse("2026-10-03T12:00:00.000Z")
const at = (minutes: number) => new Date(NOW + minutes * 60_000).toISOString()

const LIMITS: HangoutLimits = {
  titleMax: 80,
  placeMax: 120,
  capacityMin: 2,
  capacityMax: 50,
  minLeadMinutes: 15,
  maxAheadDays: 14,
}

const ready = (patch: Partial<HangoutDraft> = {}): HangoutDraft => ({
  title: "watch the derby",
  emoji: "⚽",
  place: "SUB common room",
  startsAt: at(120),
  capacity: 6,
  private: false,
  ...patch,
})

describe("hangout drafts", () => {
  it("starts with a time still to pick, for a handful of people", () => {
    expect(freshHangout(LIMITS)).toMatchObject({
      startsAt: null,
      capacity: 6,
      private: false,
    })
    expect(clampCapacity(1, LIMITS)).toBe(2)
    expect(clampCapacity(99, LIMITS)).toBe(50)
  })

  it("is ready once it has a plan, a place and a time far enough ahead", () => {
    expect(checkHangout(ready(), LIMITS, NOW).valid).toBe(true)
    expect(checkHangout(null, LIMITS, NOW).valid).toBe(false)
    expect(checkHangout(ready({ title: "  " }), LIMITS, NOW).valid).toBe(false)
    expect(checkHangout(ready({ startsAt: null }), LIMITS, NOW).valid).toBe(
      false
    )
  })

  it("says what is wrong with the time, and only once one is picked", () => {
    expect(timeProblem(null, LIMITS, NOW)).toBeNull()
    expect(timeProblem(at(5), LIMITS, NOW)).toBe(
      "Pick a time at least 15 minutes from now."
    )
    expect(timeProblem(at(15 * 24 * 60), LIMITS, NOW)).toBe(
      "A hangout can be planned up to 14 days ahead."
    )
  })

  it("lets an edit keep a time that is now too close to move to", () => {
    const started = ready({ startsAt: at(-30) })
    expect(checkHangout(started, LIMITS, NOW).valid).toBe(false)
    expect(checkHangout(started, LIMITS, NOW, at(-30)).valid).toBe(true)
  })

  it("comes back from a hangout as the draft it would edit, and notices a real change", () => {
    const from = fromHangout({
      title: "watch the derby",
      emoji: "⚽",
      place: "SUB",
      starts_at: at(120),
      capacity: 6,
      private: false,
    } as SnaccHangout)

    expect(from).toEqual(ready({ place: "SUB" }))
    expect(hangoutChanged({ ...from, title: "watch the derby " }, from)).toBe(
      false
    )
    expect(hangoutChanged({ ...from, capacity: 8 }, from)).toBe(true)
  })

  it("sends the words trimmed", () => {
    expect(
      hangoutPayload(ready({ title: " five-a-side ", place: " the pitch " }))
    ).toMatchObject({ title: "five-a-side", place: "the pitch" })
    expect(hangoutPayload(ready({ startsAt: null }))).toBeUndefined()
  })
})
