import { cn } from "@/lib/utils"
import type { WalletTransaction } from "../../types"
import {
  signedAmount,
  transactionLook,
  transactionSubtitle,
} from "../../utils/transaction-look"

export function TransactionRow({
  transaction,
  onPress,
}: {
  transaction: WalletTransaction
  onPress: (transaction: WalletTransaction) => void
}) {
  const look = transactionLook(transaction)

  return (
    <button
      type="button"
      onClick={() => onPress(transaction)}
      className="flex w-full items-center gap-3 py-3 text-left transition-transform active:scale-[0.99]"
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full",
          look.tile
        )}
      >
        <look.icon className={cn("size-5", look.glyph)} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-bold text-foreground">
          {transaction.label}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {transactionSubtitle(transaction)}
        </span>
      </span>
      <span
        className={cn("text-base font-extrabold tabular-nums", look.amount)}
      >
        {signedAmount(transaction.direction, transaction.amount)}
      </span>
    </button>
  )
}
