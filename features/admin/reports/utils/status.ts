import type { ReportStatus } from "../types"

export const STATUS_VARIANT: Record<
  ReportStatus,
  "secondary" | "default" | "outline"
> = {
  open: "secondary",
  actioned: "default",
  dismissed: "outline",
}
