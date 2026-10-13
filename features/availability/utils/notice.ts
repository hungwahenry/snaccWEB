import type { Availability } from "../types"

export function waitingTitle(availability: Availability): string {
  switch (availability.campus?.status) {
    case "pending":
      return "We're adding your campus"
    case "rejected":
      return "We couldn't add your campus"
    default:
      return "You're on the list"
  }
}

export function waitingLine(availability: Availability): string {
  const place = availability.campus?.name ?? "your campus"

  switch (availability.campus?.status) {
    case "pending":
      return `We're checking ${place} now. We'll email ${availability.email} the moment you're in.`
    case "rejected":
      return `We couldn't add ${place}. Pick your campus from the list, or add it again with its full name.`
    default:
      return `Snacc isn't open at ${place} yet. We'll email ${availability.email} the moment it is.`
  }
}

export function mustPickAgain(availability: Availability): boolean {
  return availability.campus?.status === "rejected"
}
