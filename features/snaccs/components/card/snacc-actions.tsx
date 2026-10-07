"use client"

import { MessageCircleIcon, SendIcon, type LucideIcon } from "lucide-react"
import { Bump } from "@/components/motion/bump"
import { compactCount } from "@/lib/format"
import { LikeButton } from "./like-button"
import { ResnaccButton } from "./resnacc-button"

type SnaccActionsProps = {
  likesCount: number
  liked: boolean
  commentsCount: number
  resnaccsCount: number
  myResnacc: boolean
  onSetLike: (liked: boolean) => Promise<void>
  onOpenLikers: () => void
  onOpenResnaccs?: () => void
  onComment: () => void
  onResnacc?: () => void
  onShare: () => void
}

export function SnaccActions({
  likesCount,
  liked,
  commentsCount,
  resnaccsCount,
  myResnacc,
  onSetLike,
  onOpenLikers,
  onOpenResnaccs,
  onComment,
  onResnacc,
  onShare,
}: SnaccActionsProps) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex min-w-0 flex-1 items-center">
        <LikeButton
          count={likesCount}
          liked={liked}
          onSet={onSetLike}
          onOpenLikers={onOpenLikers}
        />
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
      <Icon className="size-6" />
      {count > 0 ? (
        <Bump value={count}>
          <span className="text-sm font-bold">{compactCount(count)}</span>
        </Bump>
      ) : null}
    </button>
  )
}
