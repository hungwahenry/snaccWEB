import { describe, expect, it } from "vitest"
import { countdownLabel, secondsUntil } from "./countdown"

describe("secondsUntil", () => {
  it("counts whole seconds and never goes below zero", () => {
    const now = Date.parse("2026-01-01T00:00:00Z")
    expect(secondsUntil("2026-01-01T00:01:30.900Z", now)).toBe(90)
    expect(secondsUntil("2025-12-31T23:59:00Z", now)).toBe(0)
  })
})

describe("countdownLabel", () => {
  it("reads hours and minutes past an hour", () => {
    expect(countdownLabel(3900)).toBe("1h 5m")
  })

  it("ticks minutes and seconds under an hour", () => {
    expect(countdownLabel(245)).toBe("4:05")
    expect(countdownLabel(0)).toBe("0:00")
  })
})
