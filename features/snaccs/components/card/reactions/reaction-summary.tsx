import { compactCount } from "@/lib/format"
import type { SnaccReaction } from "../../../types"
import { TOP_REACTIONS_SHOWN } from "../../../utils/constants"

type ReactionSummaryProps = {
  reactions: SnaccReaction[]
  total: number
  onPress: () => void
}

export function ReactionSummary({
  reactions,
  total,
  onPress,
}: ReactionSummaryProps) {
  if (total === 0) return null

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onPress()
      }}
      aria-label={`${total} reactions`}
      className="flex h-9 items-center gap-1.5 rounded-full px-1 transition-colors hover:bg-accent active:scale-95"
    >
      <span className="flex items-center gap-0.5">
        {reactions.slice(0, TOP_REACTIONS_SHOWN).map((reaction) => (
          <span key={reaction.emoji} className="text-base leading-none">
            {reaction.emoji}
          </span>
        ))}
      </span>
      <span className="text-sm font-bold text-muted-foreground">
        {compactCount(total)}
      </span>
    </button>
  )
}
