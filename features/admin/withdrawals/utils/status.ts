import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type { WithdrawalStatus } from "../types"

export const WITHDRAWAL_STATUSES = [
  "pending",
  "success",
  "failed",
  "reversed",
] as const satisfies readonly WithdrawalStatus[]

export const WITHDRAWAL_STATUS: Record<WithdrawalStatus, StatusMeta> = {
  pending: { label: "With Paystack", variant: "secondary" },
  success: { label: "Paid", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
  reversed: { label: "Sent back", variant: "outline" },
}

export const STATUS_OPTIONS: Option<WithdrawalStatus>[] =
  WITHDRAWAL_STATUSES.map((status) => ({
    value: status,
    label: WITHDRAWAL_STATUS[status].label,
  }))
