import type { BirthDateDraft } from "../types"
import { daysIn, MONTH_SHORT } from "./options"

const OLDEST = 100

export const EMPTY_BIRTH_DATE: BirthDateDraft = {
  day: null,
  month: null,
  year: null,
}

export function isWholeDate(
  draft: BirthDateDraft
): draft is { day: number; month: number; year: number } {
  return draft.day !== null && draft.month !== null && draft.year !== null
}

function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function lastMonth(year: number | null, today: Date): number {
  return year === today.getFullYear() ? today.getMonth() + 1 : 12
}

function lastDay(
  month: number | null,
  year: number | null,
  today: Date
): number {
  const days =
    month === 2 && year !== null && !isLeap(year) ? 28 : daysIn(month)
  const thisMonth =
    year === today.getFullYear() && month === today.getMonth() + 1
  return thisMonth ? Math.min(days, today.getDate()) : days
}

export function birthYears(
  today: Date,
  known: { day: number; month: number } | null = null
): number[] {
  const years = Array.from(
    { length: OLDEST + 1 },
    (_, back) => today.getFullYear() - back
  )
  if (!known) return years

  return years.filter(
    (year) =>
      known.month <= lastMonth(year, today) &&
      known.day <= lastDay(known.month, year, today)
  )
}

export function birthDays(
  month: number | null,
  year: number | null,
  today: Date
): number[] {
  return Array.from(
    { length: lastDay(month, year, today) },
    (_, index) => index + 1
  )
}

const MONTHS = MONTH_SHORT.map((label, index) => ({
  value: index + 1,
  label,
}))

export function birthMonths(
  year: number | null,
  today: Date
): { value: number; label: string }[] {
  return MONTHS.slice(0, lastMonth(year, today))
}

export function fittedDate(draft: BirthDateDraft, today: Date): BirthDateDraft {
  const month =
    draft.month !== null && draft.month > lastMonth(draft.year, today)
      ? null
      : draft.month
  const day =
    draft.day !== null && draft.day > lastDay(month, draft.year, today)
      ? null
      : draft.day
  return { ...draft, month, day }
}

export function birthdayLabel(birthday: {
  day: number
  month: number
}): string {
  return `${birthday.day} ${MONTH_SHORT[birthday.month - 1]}`
}

export function ageOn(
  date: { day: number; month: number; year: number },
  today: Date
): number {
  const month = today.getMonth() + 1
  const hadBirthday =
    month > date.month || (month === date.month && today.getDate() >= date.day)
  return today.getFullYear() - date.year - (hadBirthday ? 0 : 1)
}

export function birthDateCheck(
  date: { day: number; month: number; year: number },
  today: Date
): { title: string; message: string } {
  return {
    title: "Is this right?",
    message: `You were born on ${birthdayLabel(date)} ${date.year}, which makes you ${ageOn(date, today)}. You can't change it later.`,
  }
}
