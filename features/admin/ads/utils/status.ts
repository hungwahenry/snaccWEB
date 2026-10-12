import type { StatusMeta } from "@/features/admin/shell/types"
import type {
  AdAction,
  AdEndReason,
  AdminAd,
  AdStats,
  AdStatus,
  AdStatusFilter,
  AdStatusTab,
} from "../types"

export const AD_STATUSES = [
  "pending",
  "active",
  "paused",
  "rejected",
  "ended",
] as const satisfies readonly AdStatus[]

export const AD_STATUS: Record<AdStatus, StatusMeta> = {
  pending: { label: "Pending", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  paused: { label: "Paused", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
  ended: { label: "Ended", variant: "outline" },
}

const SCHEDULED: StatusMeta = { label: "Scheduled", variant: "secondary" }
const PAUSED_BY_ADVERTISER: StatusMeta = {
  label: "Paused by advertiser",
  variant: "outline",
}

export function adStatus(
  ad: Pick<AdminAd, "status" | "starts_at" | "paused_by">,
  now = Date.now()
): StatusMeta {
  if (ad.status === "active" && Date.parse(ad.starts_at) > now) {
    return SCHEDULED
  }
  if (ad.status === "paused" && ad.paused_by === "advertiser") {
    return PAUSED_BY_ADVERTISER
  }

  return AD_STATUS[ad.status]
}

export const STATUS_FILTERS = [
  ...AD_STATUSES,
  "all",
] as const satisfies readonly AdStatusFilter[]

export function statusQuery(filter: AdStatusFilter): AdStatus | undefined {
  return filter === "all" ? undefined : filter
}

export function statusTabs(stats: AdStats | undefined): AdStatusTab[] {
  const counts = new Map(
    (stats?.by_status ?? []).map((row) => [row.status, row.count])
  )
  const count = (status: AdStatus) => (stats ? (counts.get(status) ?? 0) : null)
  const total = stats
    ? stats.by_status.reduce((sum, row) => sum + row.count, 0)
    : null

  return [
    ...AD_STATUSES.map((status) => ({
      value: status,
      label: AD_STATUS[status].label,
      count: count(status),
    })),
    { value: "all", label: "All", count: total },
  ]
}

export const END_REASON: Record<AdEndReason, string> = {
  spent: "Spent its budget",
  expired: "Reached its end date",
  cancelled: "Stopped by the advertiser",
  removed: "The snacc came down or the advertiser was suspended",
  stopped: "Ended by an admin",
}

const ACTIONS: Record<AdStatus, AdAction[]> = {
  pending: ["approve", "reject"],
  active: ["pause", "end"],
  paused: ["resume", "end"],
  rejected: [],
  ended: [],
}

export function adActions(status: AdStatus): AdAction[] {
  return ACTIONS[status]
}

export function emptyNote(filter: AdStatusFilter, searching: boolean): string {
  if (searching) return "No promotions from anyone matching that."
  if (filter === "pending") return "Nothing is waiting for review."
  if (filter === "all") return "Nobody has paid for a promotion yet."

  return `No ${AD_STATUS[filter].label.toLowerCase()} promotions.`
}
