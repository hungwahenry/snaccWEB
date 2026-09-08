const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const MONTH_SHORT: string[] = MONTH_LABELS.map((label) =>
  label.slice(0, 3)
)

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function daysIn(month: number | null): number {
  return month ? DAYS_IN_MONTH[month - 1] : 31
}
