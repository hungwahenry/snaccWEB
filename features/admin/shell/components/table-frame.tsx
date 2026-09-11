import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * The chrome around a table: an optional heading with actions beside it, filters under it, the
 * bordered table, and whatever sits beneath (usually pagination).
 */
export function TableFrame({
  title,
  description,
  actions,
  toolbar,
  footer,
  dimmed = false,
  children,
}: {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  toolbar?: ReactNode
  footer?: ReactNode
  dimmed?: boolean
  children: ReactNode
}) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      {title || description || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            {title ? <h2 className="font-medium">{title}</h2> : null}
            {description ? (
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {toolbar}
      <div
        aria-busy={dimmed || undefined}
        className={cn(
          "min-w-0 rounded-lg border transition-opacity",
          dimmed && "opacity-60"
        )}
      >
        {children}
      </div>
      {footer}
    </section>
  )
}
