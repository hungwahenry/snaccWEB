import { clockTime, formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { WalletTransaction } from "../../types"
import { transactionLook } from "../../utils/transaction-look"

export function TransactionRow({
  transaction,
  onPress,
}: {
  transaction: WalletTransaction
  onPress: (transaction: WalletTransaction) => void
}) {
  const look = transactionLook(transaction)
  const out = transaction.direction === "out"

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
          {transaction.note ? `${transaction.note} · ` : ""}
          {clockTime(transaction.created_at)}
        </span>
      </span>
      <span
        className={cn("text-base font-extrabold tabular-nums", look.amount)}
      >
        {out ? "−" : "+"}
        {formatNaira(transaction.amount)}
      </span>
    </button>
  )
}
