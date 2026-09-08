import type { ReactNode } from "react"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"

type ReactionPillProps = {
  emoji?: string
  count?: number
  reacted?: boolean
  onPress: () => void
  children?: ReactNode
}

export function ReactionPill({
  emoji,
  count,
  reacted = false,
  onPress,
  children,
}: ReactionPillProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={reacted}
      className={cn(
        "flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 transition-opacity active:opacity-70",
        reacted
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent"
      )}
    >
      {emoji ? (
        <span className="text-base leading-none">{emoji}</span>
      ) : (
        children
      )}
      {count !== undefined ? (
        <span className="text-sm font-extrabold">{compactCount(count)}</span>
      ) : null}
    </button>
  )
}
