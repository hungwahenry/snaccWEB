import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BanknoteArrowDownIcon,
  CoinsIcon,
  LandmarkIcon,
  SlidersHorizontalIcon,
  Undo2Icon,
  type LucideIcon,
} from "lucide-react"
import type { WalletTransaction, WalletTransactionType } from "../types"
import type { MoneyTone } from "./requests"

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
}

export function transactionLook(
  transaction: Pick<WalletTransaction, "type" | "direction">
): TransactionLook {
  const inbound = transaction.direction === "in"
  const icon =
    transaction.type === "transfer" && inbound
      ? ArrowDownLeftIcon
      : BY_TYPE[transaction.type]

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

const STATUS: Record<string, { label: string; tone: MoneyTone }> = {
  pending: { label: "On its way", tone: "quiet" },
  success: { label: "Completed", tone: "good" },
  failed: { label: "Failed", tone: "bad" },
  reversed: { label: "Refunded", tone: "bad" },
}

export function transactionStatus(status: string): {
  label: string
  tone: MoneyTone
} {
  return STATUS[status] ?? { label: status, tone: "quiet" }
}
