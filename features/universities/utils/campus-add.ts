import type { University } from "../types"

const MIN_NAME_LENGTH = 3

export function campusNameReady(name: string): boolean {
  return name.trim().length >= MIN_NAME_LENGTH
}

export function campusDetail(
  campus: Pick<University, "acronym" | "status">,
  country: string | null
): string {
  return [
    campus.acronym,
    country,
    campus.status === "pending" ? "Being added" : null,
  ]
    .filter(Boolean)
    .join(" · ")
}
