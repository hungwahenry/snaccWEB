import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { groupAmount } from "@/features/wallet/utils/amount"
import { cn } from "@/lib/utils"
import type { BudgetPreset, ReachEstimate } from "../../types"
import type { Money } from "@/lib/money"

export function BudgetField({
  value,
  symbol,
  hint,
  onChange,
}: {
  value: string
  symbol: string
  hint: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-lg font-bold text-muted-foreground">
          {symbol}
        </span>
        <Input
          value={value ? groupAmount(value) : ""}
          onChange={(event) => onChange(event.target.value)}
          inputMode="numeric"
          placeholder="0"
          aria-label="Budget"
          className="h-14 rounded-full pr-5 pl-10 text-lg font-bold tabular-nums md:text-lg"
        />
      </div>
      <p className="px-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

export function ReachCard({
  estimate,
  loading,
}: {
  estimate: ReachEstimate | null
  loading: boolean
}) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col gap-1 rounded-2xl bg-card p-4"
    >
      {estimate ? (
        <>
          <p className="text-base font-extrabold text-foreground">
            {estimate.people}
          </p>
          <p className="text-sm text-muted-foreground">{estimate.price}</p>
          <p className="text-sm text-muted-foreground">
            {estimate.views ?? "Add a budget to see how many views it buys."}
          </p>
        </>
      ) : loading ? (
        <>
          <Skeleton className="my-[3px] h-[18px] w-48 bg-accent" />
          <Skeleton className="my-[3px] h-3.5 w-40 bg-accent" />
          <Skeleton className="my-[3px] h-3.5 w-56 bg-accent" />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t work out the reach right now.
        </p>
      )}
    </div>
  )
}

export function BudgetPresets({
  presets,
  selected,
  onPick,
}: {
  presets: BudgetPreset[]
  selected: Money
  onPick: (amount: Money) => void
}) {
  if (presets.length === 0) return null

  return (
    <div className="grid grid-cols-3 gap-2">
      {presets.map((preset) => {
        const active = preset.amount.amount === selected.amount
        return (
          <button
            key={preset.amount.amount}
            type="button"
            aria-pressed={active}
            onClick={() => onPick(preset.amount)}
            className={cn(
              "flex min-w-0 flex-col items-center gap-0.5 rounded-2xl px-2 py-3 transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-accent"
            )}
          >
            <span className="text-base font-extrabold tabular-nums">
              {preset.label}
            </span>
            {preset.views ? (
              <span
                className={cn(
                  "max-w-full truncate text-xs",
                  active
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {preset.views}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
