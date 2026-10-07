import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Rise({
  delay = 0,
  className,
  children,
}: {
  delay?: number
  className?: string
  children: ReactNode
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "motion-safe:animate-in motion-safe:duration-500 motion-safe:fill-mode-both motion-safe:fade-in motion-safe:slide-in-from-bottom-4",
        className
      )}
    >
      {children}
    </div>
  )
}
