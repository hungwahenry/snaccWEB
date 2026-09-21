import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function HangoutDetail({
  icon: Icon,
  muted = false,
  children,
}: {
  icon: LucideIcon
  muted?: boolean
  children: ReactNode
}) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-sm">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span
        className={cn(
          "min-w-0 truncate",
          muted ? "text-muted-foreground italic" : "text-foreground"
        )}
      >
        {children}
      </span>
    </span>
  )
}
