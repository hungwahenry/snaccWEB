import { describe, expect, it } from "vitest"
import type { LiveMatch, MatchDetail } from "../types"
import { matchPollEvery, mayStillChange, pollEvery, withMatch } from "./live"

function match(overrides: Partial<LiveMatch> = {}): LiveMatch {
  return {
    id: "m1",
    competition: { code: "PL", name: "Premier League", emblem: null },
    home: { name: "Arsenal", code: "ARS", crest: null },
    away: { name: "Chelsea", code: "CHE", crest: null },
    status: "live",
    kickoff_at: "2026-09-12T15:00:00Z",
    home_score: 0,
    away_score: 0,
    ...overrides,
  }
}

const detail: MatchDetail = {
  match: match(),
  halftime: null,
  matchday: 4,
  h2h: null,
  form: { home: [], away: [] },
  standings: null,
}

describe("pollEvery", () => {
  it("polls every minute without pushes and every five with them", () => {
    expect(pollEvery(false)).toBe(60_000)
    expect(pollEvery(true)).toBe(300_000)
  })
})

describe("matchPollEvery", () => {
  it("polls only while the match is being played", () => {
    expect(matchPollEvery("live", false)).toBe(60_000)
    expect(matchPollEvery("halftime", true)).toBe(300_000)
    expect(matchPollEvery("upcoming", false)).toBe(false)
    expect(matchPollEvery("finished", false)).toBe(false)
    expect(matchPollEvery(undefined, false)).toBe(false)
  })
})

describe("mayStillChange", () => {
  it("is true until the match is over", () => {
    expect(mayStillChange("upcoming")).toBe(true)
    expect(mayStillChange("live")).toBe(true)
    expect(mayStillChange("halftime")).toBe(true)
    expect(mayStillChange("finished")).toBe(false)
    expect(mayStillChange("off")).toBe(false)
    expect(mayStillChange(undefined)).toBe(false)
  })
})

describe("withMatch", () => {
  it("swaps in the new score and keeps the rest of the detail", () => {
    const goal = match({ home_score: 1 })
    expect(withMatch(detail, goal)).toEqual({ ...detail, match: goal })
  })

  it("leaves a detail that is not loaded, or is for another match, alone", () => {
    expect(withMatch(undefined, match())).toBeUndefined()
    expect(withMatch(detail, match({ id: "m2" }))).toBe(detail)
  })
})
