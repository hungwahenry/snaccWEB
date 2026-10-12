import type { Availability } from "../types"

export const WAITING_TITLE = "You're on the list"

export function waitingLine(availability: Availability): string {
  const place = availability.campus?.name ?? "your campus"
  return `Snacc isn't open at ${place} yet. We'll email ${availability.email} the moment it is.`
}
