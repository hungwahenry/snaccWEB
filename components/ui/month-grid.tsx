import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import type { CalendarDay } from "@/lib/calendar"
import { cn } from "@/lib/utils"

export function MonthGrid({
  label,
  weekdays,
  days,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onPick,
}: {
  label: string
  weekdays: string[]
  days: CalendarDay[]
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  onPick: (date: Date) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-extrabold tracking-tight text-foreground">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <IconButton
            icon={ChevronLeftIcon}
            label="Previous month"
            disabled={!canGoPrev}
            onClick={onPrev}
            className="size-8"
            iconClassName="size-5"
          />
          <IconButton
            icon={ChevronRightIcon}
            label="Next month"
            disabled={!canGoNext}
            onClick={onNext}
            className="size-8"
            iconClassName="size-5"
          />
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
        {weekdays.map((weekday, index) => (
          <span key={index} aria-hidden className="py-1">
            {weekday}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) =>
          day.inMonth ? (
            <button
              key={day.key}
              type="button"
              disabled={day.disabled}
              aria-label={day.label}
              aria-pressed={day.selected}
              aria-current={day.today ? "date" : undefined}
              onClick={() => onPick(day.date)}
              className={cn(
                "mx-auto flex size-10 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors disabled:pointer-events-none disabled:text-muted-foreground/40",
                day.selected
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent",
                day.today && !day.selected && "ring-1 ring-border"
              )}
            >
              {day.day}
            </button>
          ) : (
            <span key={day.key} aria-hidden className="mx-auto size-10" />
          )
        )}
      </div>
    </div>
  )
}
