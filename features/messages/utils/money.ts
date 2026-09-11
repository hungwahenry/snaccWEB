import { estimatedRequestExpiry } from "@/features/wallet/utils/requests"
import { formatNaira } from "@/lib/format"
import type { AttachmentChip, MessageMoney, MoneyKind } from "../types"

const REQUEST_STATUS: Record<string, string> = {
  pending: "Waiting",
  paid: "Paid",
  declined: "Declined",
  cancelled: "Cancelled",
  expired: "Expired",
}

export function moneyLabel(kind: MoneyKind, mine: boolean): string {
  if (kind === "request") return mine ? "You asked for" : "Asked you for"
  return mine ? "You sent" : "Sent you"
}

export function requestStatusLabel(status: string): string {
  return REQUEST_STATUS[status] ?? status
}

export function moneyChip(
  money: { kind: MoneyKind; amount: number },
  mine: boolean
): AttachmentChip {
  return {
    kind: money.kind === "request" ? "money_request" : "money_sent",
    label: `${moneyLabel(money.kind, mine)} ${formatNaira(money.amount)}`,
  }
}

export interface MoneyCard {
  label: string
  amount: string
  request: boolean
  /** Money that came to you, shown in the colour of good news. */
  received: boolean
  status: string | null
  /** An open request sent to you. */
  payable: boolean
  /** A settled transfer with a receipt behind it. */
  openable: boolean
}

export function moneyCard(
  money: MessageMoney,
  mine: boolean,
  requestExpiryDays: number,
  now = Date.now()
): MoneyCard {
  const request = money.kind === "request"
  const asked = request ? money.request : null
  const expiresAt = asked
    ? estimatedRequestExpiry(asked.id, requestExpiryDays)
    : null
  // A pending request past its expiry is expired, whether or not the nightly sweep has run yet.
  const lapsed =
    asked?.status === "pending" && expiresAt !== null && expiresAt <= now
  const open = asked?.status === "pending" && !lapsed

  return {
    label: moneyLabel(money.kind, mine),
    amount: formatNaira(money.amount),
    request,
    received: !request && !mine,
    status: asked
      ? requestStatusLabel(lapsed ? "expired" : asked.status)
      : null,
    payable: open && !mine,
    openable: !request && money.transaction_id !== null,
  }
}
