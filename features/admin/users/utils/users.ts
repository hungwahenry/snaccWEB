import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { formatDate } from "@/lib/format"
import type { AccountRole, AdminUserRow } from "../types"

export type UserTab = "overview" | "manage" | "money" | "activity"
export const USER_TABS = ["overview", "manage", "money", "activity"] as const

export type AccountState = "active" | "suspended"
export const ACCOUNT_STATES = ["active", "suspended"] as const

export const ROLE_OPTIONS: Option<AccountRole>[] = [
  { value: "admin", label: "Owner accounts" },
  { value: "user", label: "Everyone else" },
]

export const STATE_OPTIONS: Option<AccountState>[] = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
]

/** A share of someone's engagement large enough to look like farming. */
export const DOMINANT_SHARE = 0.3

export const ADJUST_REASON_MAX = 200

/** The line under a name: their handle and email, or just the email. */
export function userSubtitle(user: Pick<AdminUserRow, "username" | "email">) {
  return user.username ? `@${user.username} · ${user.email}` : user.email
}

export function accountStatus(
  user: Pick<AdminUserRow, "suspended_at">
): StatusMeta {
  return user.suspended_at
    ? { label: "Suspended", variant: "destructive" }
    : { label: "Active", variant: "secondary" }
}

/** Everything unusual about an account, for the header of its page. */
export function userBadges(user: AdminUserRow): StatusMeta[] {
  return [
    user.role === "admin" && { label: "Owner", variant: "default" as const },
    user.suspended_at && {
      label: "Suspended",
      variant: "destructive" as const,
    },
    user.posts_globally && {
      label: "Posts everywhere",
      variant: "outline" as const,
    },
    user.is_private && { label: "Private", variant: "outline" as const },
    user.earnings_paused_at && {
      label: "Earnings paused",
      variant: "secondary" as const,
    },
    user.payouts_blocked_at && {
      label: "Withdrawals blocked",
      variant: "secondary" as const,
    },
  ].filter((badge): badge is StatusMeta => Boolean(badge))
}

function withReason(text: string, reason: string | null | undefined) {
  return reason ? `${text}. ${reason}` : text
}

export function suspensionSummary(user: AdminUserRow): string {
  if (!user.suspended_at) return "They can post, message and earn as normal."

  const until = user.suspended_until
    ? `, lifts ${formatDate(user.suspended_until)}`
    : ", until someone lifts it"

  return withReason(
    `Since ${formatDate(user.suspended_at)}${until}`,
    user.suspended_reason?.label
  )
}

export function earningSummary(user: AdminUserRow): string {
  if (!user.earnings_paused_at) return "New engagement keeps paying them."

  return withReason(
    `Paused ${formatDate(user.earnings_paused_at)}`,
    user.earnings_paused_reason
  )
}

export function payoutSummary(user: AdminUserRow): string {
  if (!user.payouts_blocked_at) return "They can cash out to a bank."

  return withReason(
    `Blocked ${formatDate(user.payouts_blocked_at)}`,
    user.payouts_blocked_reason
  )
}
