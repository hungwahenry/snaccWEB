import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import {
  DetailHeader,
  Fact,
  Facts,
  Section,
} from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { prettyJson } from "@/features/admin/shell/utils/json"
import { signedMoney } from "@/features/admin/shell/utils/format"
import { formatDate } from "@/lib/format"
import { formatMoney } from "@/lib/money"
import type { WalletLine, WalletTransactionRow } from "../types"
import { lineAccount, TRANSACTION_LABELS } from "../utils/wallet"

const LINES: Column<WalletLine>[] = [
  {
    id: "account",
    header: "Account",
    cell: (line) =>
      line.account.kind !== "system" && line.account.user ? (
        <UserCell user={line.account.user} note={lineAccount(line.account)} />
      ) : (
        <span className="text-sm">{lineAccount(line.account)}</span>
      ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (line) => (
      <span className={line.amount.amount < 0 ? "text-destructive" : undefined}>
        {signedMoney(line.amount)}
      </span>
    ),
  },
  {
    id: "balance",
    header: "Balance after",
    align: "end",
    className: "tabular-nums",
    cell: (line) => formatMoney(line.balance_after),
  },
]

export function PostingDetail({ posting }: { posting: WalletTransactionRow }) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={TRANSACTION_LABELS[posting.type]}
        subtitle={formatMoney(posting.amount)}
        meta={<span>{formatDate(posting.created_at)}</span>}
      />

      <Facts>
        <Fact label="Reference" value={posting.reference} mono />
        <Fact
          label="For"
          value={
            posting.user ? (
              <UserCell user={posting.user} className="justify-end" />
            ) : (
              "Snacc"
            )
          }
        />
        {posting.note ? <Fact label="Note" value={posting.note} /> : null}
      </Facts>

      <Section
        title="Both sides"
        description="Every account this posting moved money in or out of. The lines always add up to zero."
      >
        <TableFrame>
          <DataTable
            columns={LINES}
            rows={posting.lines}
            rowKey={(line) => line.id}
            empty="No lines."
          />
        </TableFrame>
      </Section>

      {posting.metadata ? (
        <Section title="Details">
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-xs">
            {prettyJson(posting.metadata)}
          </pre>
        </Section>
      ) : null}
    </div>
  )
}
