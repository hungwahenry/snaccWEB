import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { groupAmount } from "@/features/wallet/utils/amount"
import type { ReachEstimate } from "../../types"

export function BudgetField({
  value,
  hint,
  onChange,
}: {
  value: string
  hint: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-lg font-bold text-muted-foreground">
          ₦
        </span>
        <Input
          value={value ? groupAmount(value) : ""}
          onChange={(event) => onChange(event.target.value)}
          inputMode="numeric"
          placeholder="0"
          aria-label="Budget in naira"
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
