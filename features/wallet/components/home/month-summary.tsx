import { formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { WalletMonthSummary } from "../../types"

export function MonthSummary({
  summary,
}: {
  summary: WalletMonthSummary | null
}) {
  if (!summary || (summary.in === 0 && summary.out === 0)) return null

  const most = Math.max(summary.in, summary.out)

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-4">
      <span className="text-xs text-muted-foreground">This month</span>
      <Bar
        label="In"
        amount={summary.in}
        share={most > 0 ? summary.in / most : 0}
        tone="in"
      />
      <Bar
        label="Out"
        amount={summary.out}
        share={most > 0 ? summary.out / most : 0}
        tone="out"
      />
    </div>
  )
}

function Bar({
  label,
  amount,
  share,
  tone,
}: {
  label: string
  amount: number
  share: number
  tone: "in" | "out"
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "text-sm font-bold tabular-nums",
            tone === "in" ? "text-success" : "text-foreground"
          )}
        >
          {tone === "in" ? "+" : "−"}
          {formatNaira(amount)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "in" ? "bg-success" : "bg-primary"
          )}
          style={{ width: `${Math.max(share * 100, amount > 0 ? 4 : 0)}%` }}
        />
      </div>
    </div>
  )
}
