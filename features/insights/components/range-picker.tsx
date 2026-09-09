"use client"

import { RANGES } from "../routes"
import { cn } from "@/lib/utils"

export function RangePicker({
  days,
  onChange,
}: {
  days: number
  onChange: (days: number) => void
}) {
  return (
    <div className="flex gap-1 rounded-full bg-card p-1" role="group">
      {RANGES.map((range) => (
        <button
          key={range.days}
          type="button"
          aria-pressed={range.days === days}
          onClick={() => onChange(range.days)}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
            range.days === days
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
