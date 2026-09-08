import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-xs font-bold tracking-wider text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}
