import { describe, expect, it } from "vitest"
import type { SnaccHangout } from "../types"
import { joinButton, nextJoinState, withJoinState } from "./join"

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

const viewer = { host: false, campusId: "ui" }

describe("joining", () => {
  it("joins a public hangout, asks a private one, and undoes either", () => {
    expect(nextJoinState(hangout())).toBe("going")
    expect(nextJoinState(hangout({ private: true }))).toBe("requested")
    expect(nextJoinState(hangout({ join_state: "requested" }))).toBe("none")
  })

  it("moves the count only when someone goes or stops going", () => {
    expect(withJoinState(hangout(), "going")).toMatchObject({
      going_count: 3,
      full: false,
    })
    expect(
      withJoinState(
        hangout({ join_state: "going", going_count: 6, full: true }),
        "none"
      )
    ).toMatchObject({ going_count: 5, full: false })
    expect(withJoinState(hangout(), "requested").going_count).toBe(2)
  })

  it("offers the button the server would honour", () => {
    expect(joinButton(hangout(), viewer, NOW)).toEqual({
      kind: "open",
      label: "Join",
    })
    expect(joinButton(hangout({ private: true }), viewer, NOW)).toEqual({
      kind: "open",
      label: "Ask to join",
    })
    expect(joinButton(hangout(), { ...viewer, host: true }, NOW)).toEqual({
      kind: "hosting",
    })
  })

  it("says why you cannot join", () => {
    const shut = (patch: Partial<SnaccHangout>, campusId = "ui") =>
      joinButton(hangout(patch), { host: false, campusId }, NOW)

    expect(shut({ full: true })).toEqual({ kind: "shut", label: "Full" })
    expect(shut({ full: true, private: true }).kind).toBe("open")
    expect(shut({}, "lag")).toEqual({ kind: "shut", label: "Another campus" })
    expect(shut({ starts_at: at(-1), joinable_until: at(-0.5) })).toEqual({
      kind: "shut",
      label: "Started",
    })
    expect(shut({ state: "cancelled" })).toEqual({
      kind: "shut",
      label: "Called off",
    })
  })
})
