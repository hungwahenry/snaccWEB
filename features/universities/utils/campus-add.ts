import type { CampusChoice } from "../types"

const MIN_NAME_LENGTH = 3

export function campusNameReady(name: string): boolean {
  return name.trim().length >= MIN_NAME_LENGTH
}

function availability(
  campus: Pick<CampusChoice, "status" | "open">
): string | null {
  if (campus.status === "pending") return "Being added"
  return campus.open ? null : "Not open yet"
}

export function campusDetail(
  campus: Pick<CampusChoice, "acronym" | "status" | "open">,
  country: string | null
): string {
  return [campus.acronym, country, availability(campus)]
    .filter(Boolean)
    .join(" · ")
}
