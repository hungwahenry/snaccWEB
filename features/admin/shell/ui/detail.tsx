import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function DetailHeader({
  title,
  subtitle,
  badges,
  meta,
  actions,
  leading,
}: {
  title: ReactNode
  subtitle?: ReactNode
  badges?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  leading?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="flex min-w-0 items-start gap-4">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {badges}
          </div>
          {subtitle ? (
            <p className="text-sm text-pretty text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
          {meta ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {meta}
            </div>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-3", className)}>
      {title || action ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            {title ? <h2 className="text-sm font-semibold">{title}</h2> : null}
            {description ? (
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

const STAT_COLUMNS = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
} as const

export function StatGrid({
  columns = 4,
  children,
}: {
  columns?: keyof typeof STAT_COLUMNS
  children: ReactNode
}) {
  return (
    <div className={cn("grid gap-3", STAT_COLUMNS[columns])}>{children}</div>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: ReactNode
  value: ReactNode
  hint?: ReactNode
}) {
  return (
    <div className="rounded-lg border px-4 py-3">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-lg font-semibold tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="truncate text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function Facts({ children }: { children: ReactNode }) {
  return <dl className="divide-y rounded-lg border">{children}</dl>
}

export function Fact({
  label,
  value,
  mono = false,
}: {
  label: ReactNode
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-right text-sm font-medium break-words",
          mono && "font-mono text-xs"
        )}
      >
        {value}
      </dd>
    </div>
  )
}
