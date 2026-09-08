import { cn } from "@/lib/utils"
import type { MoneyTone } from "../../utils/requests"

const TONE: Record<MoneyTone, string> = {
  good: "bg-success/10 text-success",
  bad: "bg-destructive/10 text-destructive",
  quiet: "bg-muted text-muted-foreground",
  open: "bg-foreground/10 text-foreground",
}

export function StatusPill({
  label,
  tone,
}: {
  label: string
  tone: MoneyTone
}) {
  return (
    <span
      className={cn("rounded-full px-3 py-1 text-xs font-bold", TONE[tone])}
    >
      {label}
    </span>
  )
}
