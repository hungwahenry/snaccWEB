import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type { ReferralStatus } from "../types"

export const REFERRAL_STATUSES = [
  "pending",
  "qualified",
  "held",
  "paid",
  "void",
] as const satisfies readonly ReferralStatus[]

export const REFERRAL_STATUS: Record<ReferralStatus, StatusMeta> = {
  pending: { label: "Pending", variant: "secondary" },
  qualified: { label: "Qualified", variant: "outline" },
  held: { label: "Held", variant: "destructive" },
  paid: { label: "Paid", variant: "default" },
  void: { label: "Void", variant: "outline" },
}

export const STATUS_OPTIONS: Option<ReferralStatus>[] = REFERRAL_STATUSES.map(
  (status) => ({ value: status, label: REFERRAL_STATUS[status].label })
)

const REASONS: Record<string, string> = {
  shared_device: "Device already signed in as someone else",
  monthly_cap: "Over the inviter’s monthly cap",
  same_device: "Same device as the inviter",
  device_reused: "Device shared with another invitee",
  money_between: "Wallet money moved between the pair",
  burst: "Several invites within minutes",
  one_sided: "Only ever engages the inviter",
  suspended: "One side is suspended",
  reported: "One side had a report actioned",
  inactive: "Never really used Snacc",
}

export function reasonLabel(reason: string | null): string | null {
  if (!reason) return null
  return REASONS[reason] ?? reason
}
