import { formatNaira } from "@/lib/format"
import type { PayMode, SendTarget } from "../types"

export const PAY_TITLES: Record<PayMode, string> = {
  send: "Send",
  request: "Request",
  topup: "Add money",
}

export function recipientTitle(mode: PayMode, amountKobo: number): string {
  return `${PAY_TITLES[mode]} ${formatNaira(amountKobo)}`
}

export function recipientPlaceholder(mode: PayMode): string {
  return mode === "send" ? "@username or account number" : "@username on Snacc"
}

export function bankFeeNote(feeKobo: number): string | null {
  return feeKobo > 0 ? `Bank sends carry a ${formatNaira(feeKobo)} fee.` : null
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
  amountKobo: number,
  totals: { fee: number; total: number; balanceAfter: number | null }
): ReviewLine[] {
  const lines: ReviewLine[] = [
    {
      label: reviewAmountLabel(mode),
      value: formatNaira(amountKobo),
      hero: true,
    },
  ]
  if (totals.fee > 0) {
    lines.push({ label: "Bank fee", value: formatNaira(totals.fee) })
    lines.push({ label: "Total", value: formatNaira(totals.total) })
  }
  if (totals.balanceAfter !== null) {
    lines.push({
      label: "Balance after",
      value: formatNaira(totals.balanceAfter),
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
  amountKobo: number,
  totalKobo: number
): string {
  return mode === "request"
    ? `Request ${formatNaira(amountKobo)}`
    : `Send ${formatNaira(totalKobo)}`
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
