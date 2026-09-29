import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import {
  Fact,
  Facts,
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { formatNaira } from "@/lib/format"
import type {
  MoneyMetrics,
  PremiumStoreRow,
  WithdrawalStatusCount,
} from "../types"
import { countColumn } from "../utils/columns"

const WITHDRAWAL_COLUMNS: Column<WithdrawalStatusCount>[] = [
  {
    id: "status",
    header: "Status",
    className: "capitalize",
    cell: (row) => row.status,
  },
  countColumn("count", "Count", (row) => row.count),
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (row) => formatNaira(row.amount),
  },
]

const PREMIUM_COLUMNS: Column<PremiumStoreRow>[] = [
  { id: "store", header: "Bought through", cell: (row) => row.label },
  countColumn("active", "Active now", (row) => row.active),
  countColumn("started", "Started", (row) => row.started),
  countColumn("lapsed", "Lapsed", (row) => row.lapsed),
]

export function MoneyStats({ money }: { money: MoneyMetrics }) {
  return (
    <StatGrid columns={2}>
      <Stat
        label="Paid out in earnings"
        value={formatNaira(money.total_distributed)}
        hint="all time"
      />
      <Stat
        label="Wallet liability"
        value={formatNaira(money.wallet_liability)}
        hint="balances people have not withdrawn"
      />
    </StatGrid>
  )
}

export function PremiumSection({ premium }: { premium: PremiumStoreRow[] }) {
  return (
    <Section
      title="Premium"
      description="Test purchases are left out. Started and lapsed count this period."
    >
      <TableFrame>
        <DataTable
          columns={PREMIUM_COLUMNS}
          rows={premium}
          rowKey={(row) => row.store}
          empty="No Premium subscriptions yet."
        />
      </TableFrame>
    </Section>
  )
}

export function WithdrawalsSection({ money }: { money: MoneyMetrics }) {
  return (
    <Section title="All-time withdrawals">
      <TableFrame>
        <DataTable
          columns={WITHDRAWAL_COLUMNS}
          rows={money.withdrawals_by_status}
          rowKey={(row) => row.status}
          empty="No withdrawals yet."
        />
      </TableFrame>
    </Section>
  )
}

export function EarningsSection({ money }: { money: MoneyMetrics }) {
  return (
    <Section title="All-time earnings">
      <Facts>
        <Fact
          label="Total distributed"
          value={formatNaira(money.total_distributed)}
        />
        {money.earnings_by_type.map((row) => (
          <Fact
            key={row.type}
            label={row.label}
            value={formatNaira(row.amount)}
          />
        ))}
      </Facts>
    </Section>
  )
}
