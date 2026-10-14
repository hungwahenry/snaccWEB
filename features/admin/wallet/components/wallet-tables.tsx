import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { humanize, signedMoney } from "@/features/admin/shell/utils/format"
import { formatDate } from "@/lib/format"
import { formatMoney } from "@/lib/money"
import type {
  WalletDeposit,
  WalletDetail,
  WalletEntryRow,
  PayoutDestination,
} from "../types"
import {
  DEPOSIT_STATUS,
  personalAccountLine,
  destinationAccount,
} from "../utils/wallet"

const ENTRIES: Column<WalletEntryRow>[] = [
  {
    id: "when",
    header: "When",
    cell: (entry) => formatDate(entry.created_at),
  },
  {
    id: "kind",
    header: "Kind",
    cell: (entry) => humanize(entry.transaction.type),
  },
  {
    id: "reference",
    header: "Reference",
    className: "text-muted-foreground",
    cell: (entry) => (
      <span className="font-mono text-xs">{entry.transaction.reference}</span>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (entry) => (
      <span
        className={entry.amount.amount < 0 ? "text-destructive" : undefined}
      >
        {signedMoney(entry.amount)}
      </span>
    ),
  },
  {
    id: "balance",
    header: "Balance after",
    align: "end",
    className: "tabular-nums",
    cell: (entry) => formatMoney(entry.balance_after),
  },
]

const DEPOSITS: Column<WalletDeposit>[] = [
  {
    id: "when",
    header: "When",
    cell: (deposit) => formatDate(deposit.created_at),
  },
  {
    id: "status",
    header: "Status",
    cell: (deposit) => <StatusBadge status={DEPOSIT_STATUS[deposit.status]} />,
  },
  {
    id: "channel",
    header: "Channel",
    cell: (deposit) => deposit.channel ?? "—",
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (deposit) => formatMoney(deposit.amount),
  },
]

const DESTINATIONS: Column<PayoutDestination>[] = [
  {
    id: "provider",
    header: "Provider",
    cell: (destination) => destination.provider,
  },
  {
    id: "bank",
    header: "Bank",
    cell: (destination) => destination.bank_name || "—",
  },
  {
    id: "account",
    header: "Account",
    cell: destinationAccount,
  },
  {
    id: "used",
    header: "Last used",
    cell: (destination) => formatDate(destination.last_used_at),
  },
]

export function WalletEntriesTable({ entries }: { entries: WalletEntryRow[] }) {
  return (
    <TableFrame>
      <DataTable
        columns={ENTRIES}
        rows={entries}
        rowKey={(entry) => entry.id}
        empty="No movements yet."
      />
    </TableFrame>
  )
}

export function WalletDepositsTable({
  deposits,
  account,
}: {
  deposits: WalletDeposit[]
  account: WalletDetail["virtual_account"]
}) {
  return (
    <TableFrame description={personalAccountLine(account)}>
      <DataTable
        columns={DEPOSITS}
        rows={deposits}
        rowKey={(deposit) => deposit.id}
        empty="No deposits yet."
      />
    </TableFrame>
  )
}

export function PayoutDestinationsTable({
  destinations,
}: {
  destinations: PayoutDestination[]
}) {
  return (
    <TableFrame>
      <DataTable
        columns={DESTINATIONS}
        rows={destinations}
        rowKey={(destination) => destination.id}
        empty="No payout accounts yet."
      />
    </TableFrame>
  )
}
