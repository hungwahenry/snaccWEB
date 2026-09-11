import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"
import type { HistoryChip } from "../../types"
import { HISTORY_CHIPS, type MonthBar } from "../../utils/history"
import { MonthSummary } from "./month-summary"

export function ActivityHeader({
  chip,
  onChip,
  bars,
}: {
  chip: HistoryChip
  onChip: (next: HistoryChip) => void
  bars: { in: MonthBar; out: MonthBar } | null
}) {
  return (
    <div className="flex flex-col gap-3">
      {bars ? (
        <div className="px-6">
          <MonthSummary bars={bars} />
        </div>
      ) : null}
      <div className="px-6">
        <Eyebrow>Activity</Eyebrow>
      </div>
      <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden">
        {HISTORY_CHIPS.map((option) => {
          const active = option.value === chip
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChip(option.value)}
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
