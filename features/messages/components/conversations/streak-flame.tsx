import { cn } from "@/lib/utils"

export function StreakFlame({
  days,
  className,
}: {
  days: number | undefined
  className?: string
}) {
  if (!days || days <= 0) return null

  return (
    <span
      className={cn("flex items-center gap-1", className)}
      aria-label={`${days}-day streak`}
    >
      <span className="text-xs">🔥</span>
      <span className="text-xs font-bold text-foreground tabular-nums">
        {days}
      </span>
    </span>
  )
}
