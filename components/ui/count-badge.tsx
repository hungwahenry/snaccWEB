import { cn } from "@/lib/utils"

export function CountBadge({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        "pointer-events-none absolute -top-1 -right-2.5 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}
