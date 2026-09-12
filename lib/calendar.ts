import { longDate } from "./format"

export type Meridiem = "AM" | "PM"

export type DateTimeStep = "date" | "time"

export interface WheelOption<T extends string | number = number> {
  value: T
  label: string
}

export interface CalendarDay {
  key: string
  date: Date
  day: number
  label: string
  inMonth: boolean
  disabled: boolean
  today: boolean
  selected: boolean
}

export const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"]

const GRID_DAYS = 42

export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(month: Date, count: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + count, 1)
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b)
}

export function monthGrid(month: Date): Date[] {
  const first = startOfMonth(month)
  return Array.from(
    { length: GRID_DAYS },
    (_, index) =>
      new Date(
        first.getFullYear(),
        first.getMonth(),
        1 - first.getDay() + index
      )
  )
}

export function calendarDays(
  month: Date,
  range: { min: Date; max: Date; today: Date; selected: Date }
): CalendarDay[] {
  const first = startOfDay(range.min).getTime()
  const last = startOfDay(range.max).getTime()

  return monthGrid(month).map((date) => ({
    key: dayKey(date),
    date,
    day: date.getDate(),
    label: longDate(date.toISOString()),
    inMonth: date.getMonth() === month.getMonth(),
    disabled: date.getTime() < first || date.getTime() > last,
    today: isSameDay(date, range.today),
    selected: isSameDay(date, range.selected),
  }))
}

export function canShowPrevMonth(month: Date, min: Date): boolean {
  return startOfMonth(month).getTime() > startOfMonth(min).getTime()
}

export function canShowNextMonth(month: Date, max: Date): boolean {
  return startOfMonth(month).getTime() < startOfMonth(max).getTime()
}

export function withDate(value: Date, day: Date): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    value.getHours(),
    value.getMinutes()
  )
}

export function withTime(value: Date, hour: number, minute: number): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    hour,
    minute
  )
}

export function toTwelveHour(hour: number): {
  hour: number
  meridiem: Meridiem
} {
  return { hour: hour % 12 || 12, meridiem: hour < 12 ? "AM" : "PM" }
}

export function fromTwelveHour(hour: number, meridiem: Meridiem): number {
  return (hour % 12) + (meridiem === "PM" ? 12 : 0)
}

export function roundUpToStep(date: Date, stepMinutes: number): Date {
  const at = new Date(date)
  const onStep =
    at.getSeconds() === 0 &&
    at.getMilliseconds() === 0 &&
    at.getMinutes() % stepMinutes === 0
  at.setSeconds(0, 0)
  if (!onStep)
    at.setMinutes((Math.floor(at.getMinutes() / stepMinutes) + 1) * stepMinutes)
  return at
}

export const HOUR_WHEEL: WheelOption[] = Array.from(
  { length: 12 },
  (_, index) => ({ value: index + 1, label: String(index + 1) })
)

export function minuteWheel(stepMinutes: number): WheelOption[] {
  return Array.from({ length: Math.ceil(60 / stepMinutes) }, (_, index) => {
    const minute = index * stepMinutes
    return { value: minute, label: String(minute).padStart(2, "0") }
  })
}

export const MERIDIEM_WHEEL: WheelOption<Meridiem>[] = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
]
