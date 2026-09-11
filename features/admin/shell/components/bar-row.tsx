import { cn } from "@/lib/utils"

/** One labelled horizontal bar, for score spreads and distributions. */
export function BarRow({
  label,
  value,
  fraction,
  highlighted = false,
}: {
  label: string
  value: string
  fraction: number
  highlighted?: boolean
}) {
  const width = `${Math.round(Math.min(1, Math.max(0, fraction)) * 100)}%`

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "w-32 shrink-0 truncate text-right font-mono text-xs tabular-nums sm:w-44",
          highlighted ? "font-semibold" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded bg-muted">
        <div
          className={cn(
            "h-full",
            highlighted ? "bg-destructive" : "bg-foreground/35"
          )}
          style={{ width }}
        />
      </div>
      <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums">
        {value}
      </span>
    </div>
  )
}
