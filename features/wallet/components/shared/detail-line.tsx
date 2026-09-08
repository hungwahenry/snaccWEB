import { Children, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function DetailLines({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const rows = Children.toArray(children)

  return (
    <div className={className}>
      {rows.map((row, index) => (
        <div
          key={index}
          className={cn(index < rows.length - 1 && "border-b border-border/60")}
        >
          {row}
        </div>
      ))}
    </div>
  )
}

export function DetailLine({
  label,
  value,
  mono,
  hero,
}: {
  label: string
  value: string
  mono?: boolean
  hero?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        hero ? "py-4" : "py-3"
      )}
    >
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "min-w-0 text-right text-foreground",
          hero
            ? "truncate text-2xl font-extrabold tabular-nums"
            : "line-clamp-2 text-sm font-bold",
          mono && "font-mono text-xs select-all"
        )}
      >
        {value}
      </span>
    </div>
  )
}
