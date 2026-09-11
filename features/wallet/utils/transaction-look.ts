import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  BanknoteArrowDownIcon,
  CoinsIcon,
  LandmarkIcon,
  SlidersHorizontalIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react"
import { clockTime, formatNaira, shortDate } from "@/lib/format"
import type {
  MoneyDirection,
  PayoutDelivery,
  StatusLook,
  WalletTransaction,
  WalletTransactionDetail,
  WalletTransactionType,
} from "../types"

export interface TransactionLook {
  icon: LucideIcon
  tile: string
  glyph: string
  amount: string
}

const BY_TYPE: Record<WalletTransactionType, LucideIcon> = {
  transfer: ArrowUpRightIcon,
  withdrawal: LandmarkIcon,
  withdrawal_reversal: Undo2Icon,
  deposit: BanknoteArrowDownIcon,
  earnings_claim: CoinsIcon,
  adjustment: SlidersHorizontalIcon,
  premium: BadgeCheckIcon,
}

/** Green only for money in, the same everywhere money shows. */
export function transactionLook(
  transaction: Pick<WalletTransaction, "type" | "direction">
): TransactionLook {
  const inbound = transaction.direction === "in"
  const icon =
    transaction.type === "transfer" && inbound
      ? ArrowDownLeftIcon
      : (BY_TYPE[transaction.type] ?? SlidersHorizontalIcon)

  return inbound
    ? {
        icon,
        tile: "bg-success/10",
        glyph: "text-success",
        amount: "text-success",
      }
    : {
        icon,
        tile: "bg-muted",
        glyph: "text-foreground",
        amount: "text-foreground",
      }
}

export function signedAmount(
  direction: MoneyDirection,
  amount: number
): string {
  return `${direction === "in" ? "+" : "−"}${formatNaira(amount)}`
}

export function transactionSubtitle(transaction: WalletTransaction): string {
  const time = clockTime(transaction.created_at)
  return transaction.note ? `${transaction.note} · ${time}` : time
}

export function momentLabel(iso: string): string {
  return `${shortDate(iso)} · ${clockTime(iso)}`
}

const STATUS: Record<string, StatusLook> = {
  pending: { label: "On its way", tone: "quiet" },
  success: { label: "Completed", tone: "good" },
  failed: { label: "Failed", tone: "bad" },
  reversed: { label: "Refunded", tone: "bad" },
}

export function transactionStatus(status: string): StatusLook {
  return STATUS[status] ?? { label: status, tone: "quiet" }
}

const CHANNELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  dedicated_nuban: "Your account number",
}

export interface DetailRow {
  label: string
  value: string
  mono?: boolean
}

/** The label-and-value lines under a receipt, only the ones that apply. */
export function transactionRows(detail: WalletTransactionDetail): DetailRow[] {
  const rows: DetailRow[] = []

  if (detail.context?.kind === "request") {
    rows.push({ label: "For", value: detail.context.note ?? "A request" })
  }
  if (detail.context?.kind === "conversation")
    rows.push({ label: "Sent from", value: "A DM" })
  if (detail.channel) {
    rows.push({
      label: "Via",
      value: CHANNELS[detail.channel] ?? detail.channel,
    })
  }
  if (detail.fee > 0) {
    rows.push({ label: "Fee", value: formatNaira(detail.fee) })
    rows.push({ label: "Total", value: formatNaira(detail.total) })
  }
  rows.push({
    label: "Balance after",
    value: formatNaira(detail.balance_after),
  })
  rows.push({ label: "Reference", value: detail.reference, mono: true })

  return rows
}

export function deliveryLine(delivery: PayoutDelivery): string {
  return `${delivery.account_name} · ${delivery.bank_name} ••${delivery.account_last4}`
}

export function sendAgainLabel(direction: MoneyDirection): string {
  return direction === "out" ? "Send again" : "Send back"
}
