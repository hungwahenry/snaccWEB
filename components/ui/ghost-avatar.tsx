import { cn } from "@/lib/utils"
import { GhostIcon } from "lucide-react"

export function GhostAvatar({
  className,
  iconClassName,
  style,
}: {
  className?: string
  iconClassName?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={style}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-muted",
        className
      )}
    >
      <GhostIcon
        className={cn("size-5 text-muted-foreground", iconClassName)}
      />
    </div>
  )
}
