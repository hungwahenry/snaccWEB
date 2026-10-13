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

export function birthYears(thisYear: number): number[] {
  return Array.from({ length: OLDEST + 1 }, (_, back) => thisYear - back)
}

export function birthDays(month: number | null): number[] {
  return Array.from({ length: daysIn(month) }, (_, index) => index + 1)
}

export const BIRTH_MONTHS = MONTH_SHORT.map((label, index) => ({
  value: index + 1,
  label,
}))

export function withMonth(
  draft: BirthDateDraft,
  month: number
): BirthDateDraft {
  const fits = draft.day === null || draft.day <= daysIn(month)
  return { ...draft, month, day: fits ? draft.day : null }
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
