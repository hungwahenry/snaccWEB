import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"
import type { HistoryKind, WalletMonthSummary } from "../../types"
import { MonthSummary } from "./month-summary"

export type HistoryFilterValue = HistoryKind | "all"

const FILTERS: { value: HistoryFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sent", label: "Sent" },
  { value: "received", label: "Received" },
  { value: "topups", label: "Top-ups" },
  { value: "bank", label: "Bank" },
]

export function ActivityHeader({
  filter,
  onFilter,
  summary,
}: {
  filter: HistoryFilterValue
  onFilter: (next: HistoryFilterValue) => void
  summary: WalletMonthSummary | null
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="px-6">
        <MonthSummary summary={summary} />
      </div>
      <div className="px-6">
        <Eyebrow>Activity</Eyebrow>
      </div>
      <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((option) => {
          const active = option.value === filter
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onFilter(option.value)}
              className={cn(
                "flex h-8 shrink-0 items-center justify-center rounded-full px-3.5 text-xs font-bold transition-transform active:scale-95",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
