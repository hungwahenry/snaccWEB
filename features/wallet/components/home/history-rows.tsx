import type { HistoryRow } from "../../utils/history-sections"
import type { WalletTransaction } from "../../types"
import { TransactionRow } from "./transaction-row"

export function HistoryRows({
  rows,
  onOpen,
}: {
  rows: HistoryRow[]
  onOpen: (transaction: WalletTransaction) => void
}) {
  return (
    <>
      {rows.map((row) =>
        row.kind === "day" ? (
          <p
            key={row.id}
            className="px-6 pt-5 pb-1 text-xs font-bold text-muted-foreground"
          >
            {row.label}
          </p>
        ) : (
          <div key={row.id} className="px-6">
            <TransactionRow transaction={row.transaction} onPress={onOpen} />
          </div>
        )
      )}
    </>
  )
}
