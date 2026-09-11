import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { Fact, Facts, Section } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { formatNaira, formatNumber } from "@/lib/format"
import type { DashboardMoney, WithdrawalStatusCount } from "../types"

const WITHDRAWAL_COLUMNS: Column<WithdrawalStatusCount>[] = [
  {
    id: "status",
    header: "Status",
    className: "capitalize",
    cell: (row) => row.status,
  },
  {
    id: "count",
    header: "Count",
    align: "end",
    className: "tabular-nums",
    cell: (row) => formatNumber(row.count),
  },
  {
    id: "amount",
    header: "Amount",
    align: "end",
    className: "tabular-nums",
    cell: (row) => formatNaira(row.amount),
  },
]

export function WithdrawalsSection({ money }: { money: DashboardMoney }) {
  return (
    <Section title="Withdrawals">
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

export function EarningsSection({ money }: { money: DashboardMoney }) {
  return (
    <Section title="Earnings">
      <Facts>
        <Fact
          label="Total distributed"
          value={formatNaira(money.total_distributed)}
        />
        {money.earnings_by_type.map((row) => (
          <Fact
            key={row.type}
            label={<span className="capitalize">From {row.type}s</span>}
            value={formatNaira(row.amount)}
          />
        ))}
      </Facts>
    </Section>
  )
}
