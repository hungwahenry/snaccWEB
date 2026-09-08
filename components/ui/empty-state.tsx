import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  compact?: boolean
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex animate-in flex-col items-center justify-center text-center duration-300 fade-in",
        compact ? "gap-1 px-4 py-8" : "gap-2 px-8 py-16",
        className
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            "text-muted-foreground/40",
            compact ? "size-5" : "mb-1 size-10"
          )}
        />
      ) : null}

      <p
        className={cn(
          compact
            ? "text-sm text-muted-foreground"
            : "text-base font-semibold text-foreground"
        )}
      >
        {title}
      </p>

      {description ? (
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
