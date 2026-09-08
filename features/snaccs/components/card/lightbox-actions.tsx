import { MessageCircleIcon, RepeatIcon } from "lucide-react"
import { compactCount } from "@/lib/format"
import type { SnaccReaction } from "../../types"
import { ReactionSummary } from "./reactions/reaction-summary"

type LightboxActionsProps = {
  reactions: SnaccReaction[]
  reactionsCount: number
  commentsCount: number
  resnaccsCount: number
  onOpenBreakdown: () => void
  onComment: () => void
  onResnacc: () => void
}

/// The card's counts under a full-screen image, so acting on a snacc never means leaving it.
export function LightboxActions({
  reactions,
  reactionsCount,
  commentsCount,
  resnaccsCount,
  onOpenBreakdown,
  onComment,
  onResnacc,
}: LightboxActionsProps) {
  return (
    <div className="flex items-center text-white">
      <ReactionSummary
        reactions={reactions}
        total={reactionsCount}
        onPress={onOpenBreakdown}
      />

      <div className="flex-1" />

      <div className="flex items-center gap-5">
        <Count
          icon={MessageCircleIcon}
          label="Comment"
          count={commentsCount}
          onPress={onComment}
        />
        <Count
          icon={RepeatIcon}
          label="Resnacc"
          count={resnaccsCount}
          onPress={onResnacc}
        />
      </div>
    </div>
  )
}

function Count({
  icon: Icon,
  label,
  count,
  onPress,
}: {
  icon: typeof MessageCircleIcon
  label: string
  count: number
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="flex h-9 items-center gap-1.5 active:scale-95"
    >
      <Icon className="size-6" />
      {count > 0 ? (
        <span className="text-sm font-bold">{compactCount(count)}</span>
      ) : null}
    </button>
  )
}
