import { daysSince, plural } from "@/features/admin/shell/utils/format"
import type { AdminWithdrawal, WithdrawalSummary } from "../types"

/** How long the oldest unsettled withdrawal has been waiting. */
export function waitingNote(
  summary: WithdrawalSummary["pending"],
  now = Date.now()
): string {
  if (summary.count === 0 || !summary.oldest_at) return "Nothing waiting"

  const days = daysSince(summary.oldest_at, now)
  const oldest =
    days < 1 ? "oldest from today" : `oldest ${plural(days, "day")} old`

  return `${plural(summary.count, "withdrawal")} · ${oldest}`
}

/** The account the money went to, as full as the API shares it. */
export function accountLine(withdrawal: AdminWithdrawal): string {
  return withdrawal.account_number ?? `•••• ${withdrawal.account_last4}`
}

/** Only a withdrawal still with Paystack can be sent again. */
export function canRetry(withdrawal: AdminWithdrawal): boolean {
  return withdrawal.status === "pending"
}
