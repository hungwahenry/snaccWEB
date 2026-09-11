import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type {
  ReportFiling,
  ReportOutcome,
  ReportStatus,
  ReportStatusFilter,
  ReportTargetType,
} from "../types"

const REPORT_STATUSES = [
  "open",
  "actioned",
  "dismissed",
] as const satisfies readonly ReportStatus[]

export const REPORT_STATUS: Record<ReportStatus, StatusMeta> = {
  open: { label: "Open", variant: "secondary" },
  actioned: { label: "Actioned", variant: "default" },
  dismissed: { label: "Dismissed", variant: "outline" },
}

/** The list opens on open reports, so "all" has to be a value of its own. */
export const STATUS_FILTERS = [
  "all",
  ...REPORT_STATUSES,
] as const satisfies readonly ReportStatusFilter[]

export const STATUS_OPTIONS: Option<ReportStatusFilter>[] = [
  { value: "all", label: "All status" },
  ...REPORT_STATUSES.map((status) => ({
    value: status,
    label: REPORT_STATUS[status].label,
  })),
]

export function statusQuery(
  filter: ReportStatusFilter
): ReportStatus | undefined {
  return filter === "all" ? undefined : filter
}

export const OUTCOME_OPTIONS: Option<ReportOutcome>[] = [
  { value: "actioned", label: REPORT_STATUS.actioned.label },
  { value: "dismissed", label: REPORT_STATUS.dismissed.label },
]

export const TARGET_TYPES = [
  "snacc",
  "user",
  "message",
  "moment",
  "chat_message",
] as const satisfies readonly ReportTargetType[]

export const TARGET_OPTIONS: Option<ReportTargetType>[] = [
  { value: "snacc", label: "Snaccs" },
  { value: "user", label: "Users" },
  { value: "message", label: "Messages" },
  { value: "moment", label: "Moments" },
  { value: "chat_message", label: "Room messages" },
]

export function countOpen(
  filings: readonly Pick<ReportFiling, "status">[]
): number {
  return filings.filter((filing) => filing.status === "open").length
}
