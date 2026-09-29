import type { MoneyMetrics } from "../types"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"
import {
  EarningsSection,
  MoneyStats,
  PremiumSection,
  WithdrawalsSection,
} from "./money-sections"

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
      <MoneyStats money={money} />
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
      <PremiumSection premium={money.premium} />
      <div className="grid gap-6 lg:grid-cols-2">
        <WithdrawalsSection money={money} />
        <EarningsSection money={money} />
      </div>
    </div>
  )
}
