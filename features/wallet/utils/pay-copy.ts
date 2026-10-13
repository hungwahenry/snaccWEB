import { formatMoney, type Money } from "@/lib/money"
import type { PayMode, SendTarget } from "../types"

export const PAY_TITLES: Record<PayMode, string> = {
  send: "Send",
  request: "Request",
  topup: "Add money",
}

export function recipientTitle(mode: PayMode, amount: Money): string {
  return `${PAY_TITLES[mode]} ${formatMoney(amount)}`
}

export function recipientPlaceholder(mode: PayMode): string {
  return mode === "send" ? "@username or account number" : "@username on Snacc"
}

export function bankFeeNote(fee: Money): string | null {
  return fee.amount > 0 ? `Bank sends carry a ${formatMoney(fee)} fee.` : null
}

export function reviewAmountLabel(mode: PayMode): string {
  return mode === "request" ? "You are asking for" : "You are sending"
}

export interface ReviewLine {
  label: string
  value: string
  hero?: boolean
}

export function reviewLines(
  mode: PayMode,
  amount: Money,
  totals: { fee: Money; total: Money; balanceAfter: Money | null }
): ReviewLine[] {
  const lines: ReviewLine[] = [
    {
      label: reviewAmountLabel(mode),
      value: formatMoney(amount),
      hero: true,
    },
  ]
  if (totals.fee.amount > 0) {
    lines.push({ label: "Bank fee", value: formatMoney(totals.fee) })
    lines.push({ label: "Total", value: formatMoney(totals.total) })
  }
  if (totals.balanceAfter !== null) {
    lines.push({
      label: "Balance after",
      value: formatMoney(totals.balanceAfter),
    })
  }
  return lines
}

export function notePlaceholder(mode: PayMode): string {
  return mode === "request"
    ? "What is it for? (optional)"
    : "Add a note (optional)"
}

/** The server takes a longer note on a request than on a send. */
export function noteMax(mode: PayMode): number {
  return mode === "request" ? 280 : 140
}

export function reviewNote(mode: PayMode, target: SendTarget): string {
  if (mode === "request") {
    return "They get a request and can pay it in one tap. Nothing moves until they do."
  }
  return target.kind === "bank"
    ? "Bank sends cannot be reversed once they leave Snacc. Check the name above carefully."
    : "Sends between Snacc users land instantly and cannot be reversed."
}

export function submitLabel(
  mode: PayMode,
  amount: Money,
  total: Money
): string {
  return mode === "request"
    ? `Request ${formatMoney(amount)}`
    : `Send ${formatMoney(total)}`
}

/** Said under the amount once it has gone through. `to` names who it went to. */
export function doneLine(mode: PayMode, to: string): string {
  if (mode === "request") return `Asked ${to}. Nothing moves until they pay.`
  if (mode === "topup") return "Added to your wallet."
  return `Sent to ${to}.`
}

export function againLabel(mode: PayMode): string | null {
  if (mode === "topup") return null
  return mode === "request" ? "Ask someone else" : "Send another"
}
