import type { AdminReservedUsername, HoldUsernameInput } from "../types"

/** Held names whose name or reason contains what was typed. */
export function filterHeld(
  names: AdminReservedUsername[],
  search: string
): AdminReservedUsername[] {
  const needle = search.trim().toLowerCase()
  if (!needle) return names

  return names.filter(
    (held) =>
      held.name.includes(needle) || held.reason.toLowerCase().includes(needle)
  )
}

/** Held because it is also a page's address, so whoever took it would get a profile nobody can open. */
export function collidesWithRoute(held: AdminReservedUsername): boolean {
  const reason = held.reason.toLowerCase()

  return reason.includes("route") || reason.includes("path")
}

export function isHoldReady(draft: HoldUsernameInput): boolean {
  return draft.name.trim() !== "" && draft.reason.trim() !== ""
}

export function toHoldInput(draft: HoldUsernameInput): HoldUsernameInput {
  return { name: draft.name.trim().toLowerCase(), reason: draft.reason.trim() }
}
