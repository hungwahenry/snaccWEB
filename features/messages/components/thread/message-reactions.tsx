import { cn } from "@/lib/utils"
import { TAIL_REACH } from "./bubble-tail"

const CLEARANCE = TAIL_REACH + 8

export interface ReactionChip {
  emoji: string
  mine: boolean
  count?: number
}

/** The emoji under a bubble. A tap on one gives that reaction, or takes back your own. */
export function MessageReactions({
  reactions,
  mine,
  onPress,
}: {
  reactions: ReactionChip[]
  mine: boolean
  onPress?: (emoji: string) => void
}) {
  if (reactions.length === 0) return null

  return (
    <div
      className={cn(
        "-mt-2 flex flex-wrap gap-1",
        mine ? "justify-end" : "justify-start"
      )}
      style={{ [mine ? "paddingRight" : "paddingLeft"]: CLEARANCE }}
    >
      {reactions.map((reaction) => {
        const count =
          reaction.count && reaction.count > 1 ? (
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {reaction.count}
            </span>
          ) : null

        return (
          <button
            key={`${reaction.emoji}-${String(reaction.mine)}`}
            type="button"
            disabled={!onPress}
            onClick={onPress ? () => onPress(reaction.emoji) : undefined}
            aria-label={
              reaction.mine
                ? `Remove your ${reaction.emoji} reaction`
                : `React with ${reaction.emoji}`
            }
            aria-pressed={reaction.mine}
            className={cn(
              "flex animate-in items-center gap-1 rounded-full border bg-background px-1.5 py-0.5 text-xs duration-200 zoom-in-50 fade-in",
              "transition-opacity enabled:active:opacity-60 disabled:cursor-default",
              reaction.mine ? "border-foreground/40" : "border-border"
            )}
          >
            <span>{reaction.emoji}</span>
            {count}
          </button>
        )
      })}
    </div>
  )
}
