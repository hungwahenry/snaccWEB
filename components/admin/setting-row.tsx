import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * A thing you can change: what it is, what it currently is, and the control — on one line, so the
 * state and the action are never read apart. Stacks on narrow screens.
 */
export function SettingRow({
  label,
  description,
  state,
  action,
  tone = "default",
}: {
  label: string
  description?: ReactNode
  state?: ReactNode
  action?: ReactNode
  tone?: "default" | "danger"
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "text-sm font-medium",
              tone === "danger" && "text-destructive"
            )}
          >
            {label}
          </p>
          {state}
        </div>
        {description ? (
          <p className="mt-1 text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function SettingGroup({ children }: { children: ReactNode }) {
  return <div className="divide-y">{children}</div>
}
