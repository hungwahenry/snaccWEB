import { cn } from "@/lib/utils"
import type { MoneyDirection } from "../../types"
import type { MonthBar } from "../../utils/history"
import { signedAmount } from "../../utils/transaction-look"

export function MonthSummary({
  bars,
}: {
  bars: { in: MonthBar; out: MonthBar }
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-4">
      <span className="text-xs text-muted-foreground">This month</span>
      <Bar label="In" bar={bars.in} direction="in" />
      <Bar label="Out" bar={bars.out} direction="out" />
    </div>
  )
}

function Bar({
  label,
  bar,
  direction,
}: {
  label: string
  bar: MonthBar
  direction: MoneyDirection
}) {
  const inbound = direction === "in"

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "text-sm font-bold tabular-nums",
            inbound ? "text-success" : "text-foreground"
          )}
        >
          {signedAmount(direction, bar.amount)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            inbound ? "bg-success" : "bg-primary"
          )}
          style={{ width: `${bar.width}%` }}
        />
      </div>
    </div>
  )
}
