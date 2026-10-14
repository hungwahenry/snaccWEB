import { describe, expect, it } from "vitest"
import {
  ageOn,
  birthDateCheck,
  birthDays,
  birthMonths,
  birthYears,
  fittedDate,
  isWholeDate,
} from "./birth-date"

describe("birth date choices", () => {
  const today = new Date(2026, 9, 13)

  it("counts back a hundred years, and offers the days the month has", () => {
    const years = birthYears(today)
    expect(years[0]).toBe(2026)
    expect(years[years.length - 1]).toBe(1926)
    expect(birthDays(4, 2004, today)).toHaveLength(30)
  })

  it("drops a day the new month does not have", () => {
    expect(fittedDate({ day: 31, month: 4, year: 2004 }, today)).toEqual({
      day: null,
      month: 4,
      year: 2004,
    })
  })

  it("only offers 29 February in leap years", () => {
    expect(birthDays(2, 2004, today)).toHaveLength(29)
    expect(birthDays(2, 2005, today)).toHaveLength(28)
    expect(birthYears(today, { day: 29, month: 2 })).not.toContain(2025)
  })

  it("never offers a date after today", () => {
    expect(birthMonths(2026, today)).toHaveLength(10)
    expect(birthDays(10, 2026, today)).toHaveLength(13)
    expect(birthYears(today, { day: 25, month: 12 })[0]).toBe(2025)
  })

  it("needs all three parts", () => {
    expect(isWholeDate({ day: 1, month: 1, year: null })).toBe(false)
    expect(isWholeDate({ day: 1, month: 1, year: 2004 })).toBe(true)
  })
})

describe("birthDateCheck", () => {
  const today = new Date(2026, 9, 13)

  it("turns a year older on the birthday, not before", () => {
    expect(ageOn({ day: 13, month: 10, year: 2013 }, today)).toBe(13)
    expect(ageOn({ day: 14, month: 10, year: 2013 }, today)).toBe(12)
  })

  it("reads the date back with the age it makes you", () => {
    expect(
      birthDateCheck({ day: 23, month: 3, year: 2017 }, today).message
    ).toBe(
      "You were born on 23 Mar 2017, which makes you 9. You can't change it later."
    )
  })
})
