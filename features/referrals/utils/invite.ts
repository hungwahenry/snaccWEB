import { formatNaira } from "@/lib/format"
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
  return `Join me on Snacc 🍿 Sign up with my invite code ${code} and we both get paid.`
}

export function qualifySpan(days: number): string {
  return days === 7 ? "a week" : `${days} days`
}

export function rewardBlurb(
  reward: ReferralReward,
  qualifyDays: number
): string {
  const yours =
    reward.score > 0
      ? `${formatNaira(reward.referrer_kobo)} and ${reward.score} Snacc Score`
      : formatNaira(reward.referrer_kobo)
  return `Every friend who joins with your code and uses Snacc for ${qualifySpan(qualifyDays)} gets you ${yours}. They get ${formatNaira(reward.referee_kobo)} too.`
}

export type InviteCodeStatus =
  "idle" | "typing" | "checking" | "valid" | "invalid"

export function inviteCodeStatus(field: {
  typed: string
  settled: string
  checking: boolean
  found: boolean
  missing: boolean
}): InviteCodeStatus {
  if (field.typed.length === 0) return "idle"
  if (field.typed !== field.settled || !isCompleteInviteCode(field.typed))
    return "typing"
  if (field.checking) return "checking"
  if (field.found) return "valid"
  if (field.missing) return "invalid"
  return "checking"
}

export function inviteCodeSettled(status: InviteCodeStatus): boolean {
  return status === "idle" || status === "valid"
}

export const INVITEE_STATUS: Record<
  InviteeStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-foreground/10 text-foreground" },
  paid: { label: "Paid", className: "bg-success/10 text-success" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
}
