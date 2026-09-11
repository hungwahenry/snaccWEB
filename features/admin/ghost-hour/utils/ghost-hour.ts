import { clock } from "@/features/admin/shell/utils/format"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import { formatDate } from "@/lib/format"
import type { GhostWindowState } from "../types"

/**
 * Milliseconds left in an open window, measured on the server's clock plus the time since it was
 * read, or null when no window is open.
 */
export function remainingMs(
  state: GhostWindowState | undefined,
  elapsed: number
): number | null {
  if (!state?.active || !state.ends_at) return null

  return Math.max(
    0,
    Date.parse(state.ends_at) - Date.parse(state.server_time) - elapsed
  )
}

/** The line under the headline: the countdown while open, else what comes next. */
export function windowNote(
  state: GhostWindowState,
  remaining: number | null
): string {
  if (state.active && remaining !== null) {
    return `${clock(remaining)} left — closes ${formatDate(state.ends_at)}`
  }
  if (state.starts_at) return `Next window opens ${formatDate(state.starts_at)}`

  return "Nothing scheduled. The nightly job picks a slot each morning."
}

export function openedMessage(state: GhostWindowState): string {
  return `Ghost Hour opened — pushed to ${state.pushed ?? 0} device(s).`
}

export const WINDOW_MINUTES_INVALID = "Enter a whole number of minutes."

/** The length typed when opening by hand. Left blank, the window runs for the usual length. */
export function parseWindowMinutes(
  raw: string
): { ok: true; minutes: number | undefined } | { ok: false } {
  if (raw.trim() === "") return { ok: true, minutes: undefined }

  const minutes = parseWholeNumber(raw, { min: 1 })

  return minutes === null ? { ok: false } : { ok: true, minutes }
}
