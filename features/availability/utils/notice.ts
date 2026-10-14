import type { Availability } from "../types"

export function waitingTitle(availability: Availability): string {
  if (!availability.campus) return "Pick your campus"

  switch (availability.campus.status) {
    case "pending":
      return "We're adding your campus"
    case "rejected":
      return "We couldn't add your campus"
    default:
      return "You're on the list"
  }
}

export function waitingLine(availability: Availability): string {
  if (!availability.campus) {
    return "Your campus is no longer on Snacc. Pick it again from the list to carry on."
  }
  const place = availability.campus.name

  switch (availability.campus.status) {
    case "pending":
      return `We're checking ${place} now. We'll email ${availability.email} the moment you're in.`
    case "rejected":
      return `We couldn't add ${place}. Pick your campus from the list, or add it again with its full name.`
    default:
      return `Snacc isn't open at ${place} yet. We'll email ${availability.email} the moment it is.`
  }
}

export function mustPickAgain(availability: Availability): boolean {
  return (
    availability.campus === null || availability.campus.status === "rejected"
  )
}
