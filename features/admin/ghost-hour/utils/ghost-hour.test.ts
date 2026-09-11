import { describe, expect, it } from "vitest"
import { formatDate } from "@/lib/format"
import type { GhostWindowState } from "../types"
import {
  openedMessage,
  parseWindowMinutes,
  remainingMs,
  windowNote,
} from "./ghost-hour"

const open: GhostWindowState = {
  active: true,
  starts_at: "2026-09-10T20:00:00Z",
  ends_at: "2026-09-10T21:00:00Z",
  server_time: "2026-09-10T20:58:00Z",
  window_minutes: 60,
}

const closed: GhostWindowState = {
  active: false,
  starts_at: null,
  ends_at: null,
  server_time: "2026-09-10T12:00:00Z",
  window_minutes: 60,
}

describe("remainingMs", () => {
  it("counts down from the server's clock", () => {
    expect(remainingMs(open, 0)).toBe(120_000)
    expect(remainingMs(open, 30_000)).toBe(90_000)
  })

  it("stops at zero", () => {
    expect(remainingMs(open, 500_000)).toBe(0)
  })

  it("is null with no open window", () => {
    expect(remainingMs(closed, 0)).toBeNull()
    expect(remainingMs(undefined, 0)).toBeNull()
  })
})

describe("windowNote", () => {
  it("shows the countdown while open", () => {
    expect(windowNote(open, 83_000)).toBe(
      `1:23 left — closes ${formatDate(open.ends_at)}`
    )
  })

  it("says when the next window opens, or that none is scheduled", () => {
    const next = { ...closed, starts_at: "2026-09-10T20:00:00Z" }
    expect(windowNote(next, null)).toBe(
      `Next window opens ${formatDate(next.starts_at)}`
    )
    expect(windowNote(closed, null)).toBe(
      "Nothing scheduled. The nightly job picks a slot each morning."
    )
  })
})

describe("openedMessage", () => {
  it("says how many devices were pushed", () => {
    expect(openedMessage({ ...open, pushed: 12 })).toBe(
      "Ghost Hour opened — pushed to 12 device(s)."
    )
    expect(openedMessage(open)).toBe(
      "Ghost Hour opened — pushed to 0 device(s)."
    )
  })
})

describe("parseWindowMinutes", () => {
  it("leaves a blank length to the default", () => {
    expect(parseWindowMinutes(" ")).toEqual({ ok: true, minutes: undefined })
  })

  it("takes a whole number of minutes", () => {
    expect(parseWindowMinutes("45")).toEqual({ ok: true, minutes: 45 })
  })

  it("refuses anything else", () => {
    expect(parseWindowMinutes("0")).toEqual({ ok: false })
    expect(parseWindowMinutes("1.5")).toEqual({ ok: false })
    expect(parseWindowMinutes("soon")).toEqual({ ok: false })
  })
})
