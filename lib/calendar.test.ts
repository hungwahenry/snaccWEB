import { describe, expect, it } from "vitest"
import {
  addMonths,
  calendarDays,
  canShowNextMonth,
  canShowPrevMonth,
  dayKey,
  fromTwelveHour,
  HOUR_WHEEL,
  minuteWheel,
  monthGrid,
  roundUpToStep,
  toTwelveHour,
  withDate,
  withTime,
} from "./calendar"

const day = (month: number, date: number, hour = 0, minute = 0, second = 0) =>
  new Date(2026, month, date, hour, minute, second)

describe("monthGrid", () => {
  it("fills six weeks from the Sunday on or before the 1st", () => {
    const grid = monthGrid(day(8, 12))
    expect(grid).toHaveLength(42)
    expect(dayKey(grid[0])).toBe("2026-08-30")
    expect(dayKey(grid[2])).toBe("2026-09-01")
    expect(dayKey(grid[41])).toBe("2026-10-10")
  })
})

describe("calendarDays", () => {
  const range = {
    min: day(8, 12, 16, 5),
    max: day(9, 11, 23, 55),
    today: day(8, 12, 15, 0),
    selected: day(8, 14, 9, 0),
  }

  it("marks today, the chosen day and the days of other months", () => {
    const days = calendarDays(day(8, 1), range)
    const find = (key: string) => days.find((entry) => entry.key === key)

    expect(find("2026-09-12")).toMatchObject({
      day: 12,
      inMonth: true,
      today: true,
      selected: false,
      disabled: false,
    })
    expect(find("2026-09-14")?.selected).toBe(true)
    expect(find("2026-08-30")?.inMonth).toBe(false)
  })

  it("closes the days before the first allowed day and after the last", () => {
    const september = calendarDays(day(8, 1), range)
    const october = calendarDays(day(9, 1), range)

    expect(
      september.find((entry) => entry.key === "2026-09-11")?.disabled
    ).toBe(true)
    expect(october.find((entry) => entry.key === "2026-10-11")?.disabled).toBe(
      false
    )
    expect(october.find((entry) => entry.key === "2026-10-12")?.disabled).toBe(
      true
    )
  })
})

describe("month arrows", () => {
  it("stop at the months the range reaches", () => {
    const min = day(8, 12)
    const max = day(9, 11)
    expect(canShowPrevMonth(day(8, 1), min)).toBe(false)
    expect(canShowNextMonth(day(8, 1), max)).toBe(true)
    expect(canShowPrevMonth(day(9, 1), min)).toBe(true)
    expect(canShowNextMonth(day(9, 1), max)).toBe(false)
  })

  it("step across the end of the year", () => {
    expect(dayKey(addMonths(new Date(2026, 11, 20), 1))).toBe("2027-01-01")
    expect(dayKey(addMonths(new Date(2027, 0, 5), -1))).toBe("2026-12-01")
  })
})

describe("withDate and withTime", () => {
  it("moves the day and keeps the time", () => {
    expect(withDate(day(8, 12, 16, 10), day(8, 20))).toEqual(day(8, 20, 16, 10))
  })

  it("sets the time and keeps the day", () => {
    expect(withTime(day(8, 12, 16, 10), 9, 5)).toEqual(day(8, 12, 9, 5))
  })
})

describe("twelve-hour time", () => {
  it("round-trips every hour of the day", () => {
    for (let hour = 0; hour < 24; hour += 1) {
      const twelve = toTwelveHour(hour)
      expect(fromTwelveHour(twelve.hour, twelve.meridiem)).toBe(hour)
    }
  })

  it("calls midnight 12 AM and noon 12 PM", () => {
    expect(toTwelveHour(0)).toEqual({ hour: 12, meridiem: "AM" })
    expect(toTwelveHour(12)).toEqual({ hour: 12, meridiem: "PM" })
    expect(toTwelveHour(16)).toEqual({ hour: 4, meridiem: "PM" })
  })
})

describe("roundUpToStep", () => {
  it("leaves a time on the step alone and rounds anything else up", () => {
    expect(roundUpToStep(day(8, 12, 16, 10), 5)).toEqual(day(8, 12, 16, 10))
    expect(roundUpToStep(day(8, 12, 16, 7), 5)).toEqual(day(8, 12, 16, 10))
    expect(roundUpToStep(day(8, 12, 16, 10, 1), 5)).toEqual(day(8, 12, 16, 15))
    expect(roundUpToStep(day(8, 12, 23, 58), 5)).toEqual(day(8, 13, 0, 0))
  })
})

describe("wheels", () => {
  it("count hours one to twelve and minutes in steps", () => {
    expect(HOUR_WHEEL.map((option) => option.value)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
    expect(minuteWheel(5).map((option) => option.label)).toEqual([
      "00",
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55",
    ])
  })
})
