import { cn } from "@/lib/utils"
import { changeTone, formatChange } from "../utils/price"

const TONE_TEXT = {
  up: "text-success",
  down: "text-destructive",
  flat: "text-muted-foreground",
} as const

export function CashtagChange({
  label,
  pct,
  className,
}: {
  label: string
  pct: number | null
  className?: string
}) {
  const change = formatChange(pct)
  if (!change) return null

  return (
    <span className={cn("text-[11px]", className)}>
      <span
        className={cn("font-bold tabular-nums", TONE_TEXT[changeTone(pct)])}
      >
        {change}
      </span>
      <span className="text-muted-foreground"> {label}</span>
    </span>
  )
}
