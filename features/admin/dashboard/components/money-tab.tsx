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
  const several = money.currencies.length > 1

  return (
    <div className="flex flex-col gap-6">
      {campusPicked ? (
        <p className="text-sm text-pretty text-muted-foreground">
          Money always covers the whole platform, whichever campus is picked.
        </p>
      ) : null}
      {money.currencies.map((section) => (
        <div key={section.currency} className="flex flex-col gap-6">
          {several ? (
            <h3 className="text-lg font-bold">{section.currency}</h3>
          ) : null}
          <MoneyStats money={section} />
          <ChartFrame
            title="Earnings per day"
            description="What people earned, by what they earned it for."
          >
            <BreakdownChart
              breakdown={section.earnings}
              currency={section.currency}
            />
          </ChartFrame>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame
              title="Wallet movement per day"
              description="Money moving through wallets, by kind."
            >
              <BreakdownChart
                breakdown={section.wallet}
                currency={section.currency}
              />
            </ChartFrame>
            <ChartFrame
              title="Withdrawals per day"
              description="Asked for each day, by where they ended up."
            >
              <BreakdownChart
                breakdown={section.withdrawals}
                currency={section.currency}
              />
            </ChartFrame>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <WithdrawalsSection money={section} />
            <EarningsSection money={section} />
          </div>
        </div>
      ))}
      <PremiumSection premium={money.premium} />
    </div>
  )
}
