import { describeMinutes } from "@/features/admin/shell/utils/format"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  NotificationTypeDraft,
  NotificationTypePatch,
  NotificationTypeRow,
} from "../types"

/** Types whose key, label or wording contains what was typed. */
export function filterTypes(
  rows: NotificationTypeRow[],
  search: string
): NotificationTypeRow[] {
  const needle = search.trim().toLowerCase()
  if (!needle) return rows

  return rows.filter(
    (row) =>
      row.key.toLowerCase().includes(needle) ||
      row.label.toLowerCase().includes(needle) ||
      row.body_template.toLowerCase().includes(needle)
  )
}

/** How a type folds repeat events into one row. */
export function groupingText(row: NotificationTypeRow): string {
  if (!row.aggregates) return "one per event"

  return row.group_window_minutes
    ? `folds for ${describeMinutes(row.group_window_minutes)}`
    : "folds indefinitely"
}

export function draftFrom(row: NotificationTypeRow): NotificationTypeDraft {
  return {
    label: row.label,
    body: row.body_template,
    detail: row.detail_template ?? "",
    push: row.default_push,
    email: row.default_email,
    instant: row.instant_email,
    window: String(row.group_window_minutes ?? ""),
  }
}

export const WINDOW_INVALID =
  "Use a whole number of minutes, or leave it blank."

/** The window in minutes: blank means none, anything else must be a whole number. */
function windowMinutes(draft: NotificationTypeDraft): number | null {
  if (draft.window.trim() === "") return 0

  return parseWholeNumber(draft.window, { min: 0 })
}

export function isDraftReady(draft: NotificationTypeDraft): boolean {
  return windowMinutes(draft) !== null
}

export function toPatch(draft: NotificationTypeDraft): NotificationTypePatch {
  return {
    label: draft.label,
    bodyTemplate: draft.body,
    detailTemplate: draft.detail,
    defaultPush: draft.push,
    defaultEmail: draft.email,
    instantEmail: draft.instant,
    groupWindowMinutes: windowMinutes(draft) ?? 0,
  }
}
