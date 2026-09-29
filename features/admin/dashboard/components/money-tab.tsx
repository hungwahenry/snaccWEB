import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import {
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { formatNaira } from "@/lib/format"
import type { MoneyMetrics, PremiumStoreRow } from "../types"
import { countColumn } from "../utils/columns"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"
import { EarningsSection, WithdrawalsSection } from "./money-sections"

const PREMIUM_COLUMNS: Column<PremiumStoreRow>[] = [
  { id: "store", header: "Bought through", cell: (row) => row.label },
  countColumn("active", "Active now", (row) => row.active),
  countColumn("started", "Started", (row) => row.started),
  countColumn("lapsed", "Lapsed", (row) => row.lapsed),
]

export function MoneyTab({
  money,
  campusPicked,
}: {
  money: MoneyMetrics
  campusPicked: boolean
}) {
  return (
    <div className="flex flex-col gap-6">
      {campusPicked ? (
        <p className="text-sm text-pretty text-muted-foreground">
          Money always covers the whole platform, whichever campus is picked.
        </p>
      ) : null}
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
      <ChartFrame
        title="Earnings per day"
        description="What people earned, by what they earned it for."
      >
        <BreakdownChart breakdown={money.earnings} money />
      </ChartFrame>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFrame
          title="Wallet movement per day"
          description="Money moving through wallets, by kind."
        >
          <BreakdownChart breakdown={money.wallet} money />
        </ChartFrame>
        <ChartFrame
          title="Withdrawals per day"
          description="Asked for each day, by where they ended up."
        >
          <BreakdownChart breakdown={money.withdrawals} money />
        </ChartFrame>
      </div>
      <Section
        title="Premium"
        description="Test purchases are left out. Started and lapsed count this period."
      >
        <TableFrame>
          <DataTable
            columns={PREMIUM_COLUMNS}
            rows={money.premium}
            rowKey={(row) => row.store}
            empty="No Premium subscriptions yet."
          />
        </TableFrame>
      </Section>
      <div className="grid gap-6 lg:grid-cols-2">
        <WithdrawalsSection money={money} />
        <EarningsSection money={money} />
      </div>
    </div>
  )
}
