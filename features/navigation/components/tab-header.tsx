import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function TabHeader({
  title,
  right,
  className,
}: {
  title: string
  right?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/90 px-4 backdrop-blur",
        className
      )}
    >
      <h1 className="truncate text-lg font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      {right ? (
        <div className="ml-auto flex items-center gap-1">{right}</div>
      ) : null}
    </header>
  )
}
