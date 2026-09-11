import type { ReportFiling } from "@/features/admin/reports/types"
import { countOpen } from "@/features/admin/reports/utils/status"
import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { plural } from "@/features/admin/shell/utils/format"
import { formatNumber } from "@/lib/format"
import type { AdminSnacc, SnaccContent, SnaccState } from "../types"

export const SNACC_STATES = [
  "live",
  "deleted",
] as const satisfies readonly SnaccState[]

export const STATE_OPTIONS: Option<SnaccState>[] = [
  { value: "live", label: "Live" },
  { value: "deleted", label: "Removed" },
]

/** The text a snaccs row links with: its body, else what is attached. */
export function snaccPreview(
  snacc: Pick<SnaccContent, "body" | "images" | "gif">
): string {
  if (snacc.body) return snacc.body
  if (snacc.images.length) return `${snacc.images.length} image(s)`
  if (snacc.gif) return "GIF"
  return "—"
}

export function snaccStatus(
  snacc: Pick<AdminSnacc, "deleted_at" | "pinned">
): StatusMeta {
  if (snacc.deleted_at) return { label: "Removed", variant: "destructive" }
  if (snacc.pinned) return { label: "Pinned", variant: "secondary" }
  return { label: "Live", variant: "outline" }
}

/** Everything unusual about a snacc, for its card and the header of its page. */
export function snaccBadges(
  snacc: Pick<AdminSnacc, "pinned" | "held_at" | "deleted_at">
): StatusMeta[] {
  const badges: (StatusMeta | false)[] = [
    snacc.pinned && { label: "Pinned", variant: "outline" },
    snacc.held_at !== null && { label: "Held", variant: "secondary" },
    snacc.deleted_at !== null && { label: "Removed", variant: "destructive" },
  ]

  return badges.filter((badge): badge is StatusMeta => badge !== false)
}

export function isBlank(snacc: SnaccContent): boolean {
  return (
    !snacc.body &&
    snacc.images.length === 0 &&
    !snacc.gif &&
    !snacc.sticker &&
    !snacc.voice
  )
}

export function engagementLine(
  snacc: Pick<AdminSnacc, "reactions_count" | "comments_count" | "views_count">
): string {
  return `${formatNumber(snacc.reactions_count)} rx · ${formatNumber(snacc.comments_count)} co · ${formatNumber(snacc.views_count)} vw`
}

/** "3 reports · 1 open": how often a snacc was flagged, and how much is still waiting. */
export function reportTally(
  reports: readonly Pick<ReportFiling, "status">[]
): string {
  const open = countOpen(reports)

  return `${plural(reports.length, "report")}${open > 0 ? ` · ${open} open` : ""}`
}
