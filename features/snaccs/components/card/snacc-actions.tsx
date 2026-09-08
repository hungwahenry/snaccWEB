import {
  GhostIcon,
  MessageCircleIcon,
  SendIcon,
  type LucideIcon,
} from "lucide-react"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { compactCount } from "@/lib/format"
import type { SnaccReaction } from "../../types"
import { ReactionSummary } from "./reactions/reaction-summary"
import { ResnaccButton } from "./resnacc-button"

type SnaccActionsProps = {
  reactions: SnaccReaction[]
  reactionsCount: number
  myReaction: string | null
  commentsCount: number
  resnaccsCount: number
  myResnacc: boolean
  anonymous?: boolean
  onReact: (emoji: string) => void
  onOpenBreakdown: () => void
  onComment: () => void
  onResnacc: () => void
  onShare: () => void
}

export function SnaccActions({
  reactions,
  reactionsCount,
  myReaction,
  commentsCount,
  resnaccsCount,
  myResnacc,
  anonymous,
  onReact,
  onOpenBreakdown,
  onComment,
  onResnacc,
  onShare,
}: SnaccActionsProps) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <div className="min-w-0 shrink overflow-hidden">
          <ReactionSummary
            reactions={reactions}
            total={reactionsCount}
            onPress={onOpenBreakdown}
          />
        </div>
        <div className="shrink-0">
          <ReactionPicker mine={myReaction} onSelect={onReact} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Action
          icon={MessageCircleIcon}
          label="Comment"
          count={commentsCount}
          onPress={onComment}
        />
        {anonymous ? (
          <span
            className="flex h-9 items-center justify-center px-1.5 text-muted-foreground"
            title="Ghost posts can't be resnacced"
          >
            <GhostIcon className="size-[22px]" />
          </span>
        ) : (
          <ResnaccButton
            count={resnaccsCount}
            mine={myResnacc}
            onPress={onResnacc}
          />
        )}
        <Action icon={SendIcon} label="Share" count={0} onPress={onShare} />
      </div>
    </div>
  )
}

function Action({
  icon: Icon,
  label,
  count,
  onPress,
}: {
  icon: LucideIcon
  label: string
  count: number
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="flex h-9 items-center gap-1.5 rounded-full px-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
    >
      <Icon className="size-[22px]" />
      {count > 0 ? (
        <span className="text-sm font-bold">{compactCount(count)}</span>
      ) : null}
    </button>
  )
}
