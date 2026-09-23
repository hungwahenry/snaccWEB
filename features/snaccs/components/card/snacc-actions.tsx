"use client"

import { MessageCircleIcon, SendIcon, type LucideIcon } from "lucide-react"
import { useRef } from "react"
import { Bump } from "@/components/motion/bump"
import { ReactionBursts } from "@/components/motion/reaction-bursts"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { useReactionBursts } from "@/hooks/use-reaction-bursts"
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
  onReact?: (emoji: string) => void
  onOpenBreakdown?: () => void
  onOpenResnaccs?: () => void
  onComment: () => void
  onResnacc?: () => void
  onShare: () => void
}

export function SnaccActions({
  reactions,
  reactionsCount,
  myReaction,
  commentsCount,
  resnaccsCount,
  myResnacc,
  onReact,
  onOpenBreakdown,
  onOpenResnaccs,
  onComment,
  onResnacc,
  onShare,
}: SnaccActionsProps) {
  const bursts = useReactionBursts()
  const trigger = useRef<HTMLDivElement>(null)

  function react(emoji: string) {
    if (!onReact) return
    const box = trigger.current?.getBoundingClientRect()
    if (box && emoji !== myReaction) {
      bursts.add(emoji, box.width / 2, box.height / 2)
    }
    onReact(emoji)
  }

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
        {onReact ? (
          <div ref={trigger} className="relative shrink-0">
            <ReactionPicker mine={myReaction} onSelect={react} />
            <ReactionBursts bursts={bursts.bursts} onDone={bursts.remove} />
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Action
          icon={MessageCircleIcon}
          label="Comment"
          count={commentsCount}
          onPress={onComment}
        />
        {onResnacc ? (
          <ResnaccButton
            count={resnaccsCount}
            mine={myResnacc}
            onPress={onResnacc}
            onLongPress={resnaccsCount > 0 ? onOpenResnaccs : undefined}
          />
        ) : null}
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
        <Bump value={count}>
          <span className="text-sm font-bold">{compactCount(count)}</span>
        </Bump>
      ) : null}
    </button>
  )
}
