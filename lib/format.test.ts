import { describe, expect, it, vi } from "vitest"
import {
  badgeCount,
  compactCount,
  countLabel,
  dateAtTime,
  dayLabel,
  formatDuration,
  koboToInput,
  monthYear,
  nairaToKobo,
  shortDate,
  timeAgo,
  utcHourToLocal,
  weekdayDate,
  weekdayDay,
} from "./format"

describe("weekdayDate", () => {
  it("names the weekday, then the date", () => {
    const at = new Date(2026, 9, 14, 21, 5).toISOString()
    expect(weekdayDay(at)).toBe("Wed 14")
    expect(weekdayDate(at)).toBe("Wed 14 Oct")
  })

  it("says the day and the time together", () => {
    expect(dateAtTime(new Date(2026, 9, 14, 21, 5).toISOString())).toBe(
      "Wed 14 Oct at 9:05 PM"
    )
  })

  it("reads the time on a given clock when asked, the day included", () => {
    expect(dateAtTime("2026-10-14T23:30:00.000Z", "Africa/Lagos")).toBe(
      "Thu 15 Oct at 12:30 AM"
    )
  })
})

describe("monthYear", () => {
  it("names the month in full with its year", () => {
    expect(monthYear(new Date(2026, 8, 12).toISOString())).toBe(
      "September 2026"
    )
  })
})

describe("compactCount", () => {
  it("shortens big numbers without rounding up", () => {
    expect(compactCount(999)).toBe("999")
    expect(compactCount(1000)).toBe("1k")
    expect(compactCount(1290)).toBe("1.2k")
    expect(compactCount(2_500_000)).toBe("2.5m")
  })
})

describe("countLabel", () => {
  it("picks the singular for exactly one", () => {
    expect(countLabel(1, "reply", "replies")).toBe("1 reply")
    expect(countLabel(0, "reply", "replies")).toBe("0 replies")
    expect(countLabel(1200, "snacc")).toBe("1.2k snaccs")
  })
})

describe("money", () => {
  it("round-trips kobo through what someone types", () => {
    expect(koboToInput(150_000)).toBe("1500")
    expect(koboToInput(150_050)).toBe("1500.50")
    expect(nairaToKobo("1500.5")).toBe(150_050)
    expect(nairaToKobo("12a")).toBe(0)
  })
})

describe("formatDuration", () => {
  it("says seconds, then minutes and seconds", () => {
    expect(formatDuration(42.4)).toBe("42s")
    expect(formatDuration(75)).toBe("1m 15s")
  })
})

describe("timeAgo", () => {
  it("counts up in seconds, minutes, hours and days, then gives the date", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-09-11T12:00:00Z"))
    const ago = (ms: number) => new Date(Date.now() - ms).toISOString()

    expect(timeAgo(ago(5_000))).toBe("5s")
    expect(timeAgo(ago(5 * 60_000))).toBe("5m")
    expect(timeAgo(ago(5 * 3_600_000))).toBe("5h")
    expect(timeAgo(ago(3 * 86_400_000))).toBe("3d")
    expect(timeAgo(ago(30 * 86_400_000))).toBe(shortDate(ago(30 * 86_400_000)))
    expect(timeAgo(new Date(Date.now() + 60_000).toISOString())).toBe("0s")
    vi.useRealTimers()
  })
})

describe("dayLabel", () => {
  it("names today and yesterday", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 11, 15))
    expect(dayLabel(new Date(2026, 8, 11, 9).toISOString())).toBe("Today")
    expect(dayLabel(new Date(2026, 8, 10, 23).toISOString())).toBe("Yesterday")
    vi.useRealTimers()
  })
})

describe("utcHourToLocal", () => {
  it("stays within the day", () => {
    for (const hour of [0, 12, 23]) {
      const local = utcHourToLocal(hour)
      expect(local).toBeGreaterThanOrEqual(0)
      expect(local).toBeLessThan(24)
    }
  })
})

describe("badgeCount", () => {
  it("caps at 99+", () => {
    expect(badgeCount(7)).toBe("7")
    expect(badgeCount(99)).toBe("99")
    expect(badgeCount(140)).toBe("99+")
  })
})
