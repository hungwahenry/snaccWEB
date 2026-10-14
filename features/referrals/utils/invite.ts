import { formatMoney } from "@/lib/money"
import type { InviteeStatus, ReferralReward } from "../types"

export const CODE_MIN = 4
export const CODE_MAX = 12

export function normalizeInviteCode(raw: string): string {
  return raw.replace(/[\s-]/g, "").toUpperCase().slice(0, CODE_MAX)
}

export function isCompleteInviteCode(code: string): boolean {
  return code.length >= CODE_MIN
}

export function inviteMessage(code: string): string {
  return `Join me on Snacc 🍿 Sign up with my invite code ${code}.`
}

export function qualifySpan(days: number): string {
  return days === 7 ? "a week" : `${days} days`
}

export function rewardBlurb(
  reward: ReferralReward,
  qualifyDays: number
): string {
  const yours = [
    reward.referrer.amount > 0 ? formatMoney(reward.referrer) : null,
    reward.score > 0 ? `${reward.score} Snacc Score` : null,
  ].filter(Boolean)
  if (yours.length === 0) return "Bring your friends to Snacc."

  const welcome =
    reward.referee.amount > 0 ? " They can get a welcome reward too." : ""
  return `Every friend who joins with your code and uses Snacc for ${qualifySpan(qualifyDays)} gets you ${yours.join(" and ")}.${welcome}`
}

export const INVITEE_STATUS: Record<
  InviteeStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-foreground/10 text-foreground" },
  paid: { label: "Paid", className: "bg-success/10 text-success" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
}
