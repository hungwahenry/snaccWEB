"use client"

import {
  BookmarkIcon,
  MessageCircleIcon,
  SendIcon,
  type LucideIcon,
} from "lucide-react"
import { Bump } from "@/components/motion/bump"
import { saveLabel } from "@/features/bookmarks/utils/labels"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"
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
  saved: boolean
  onToggleSave?: () => void
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
  saved,
  onToggleSave,
}: SnaccActionsProps) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <LikeButton
          count={likesCount}
          liked={liked}
          onSet={onSetLike}
          onOpenLikers={onOpenLikers}
        />
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
        <Action icon={SendIcon} label="Share" onPress={onShare} />
      </div>

      {onToggleSave ? (
        <Action
          icon={BookmarkIcon}
          label={saveLabel(saved)}
          pressed={saved}
          onPress={onToggleSave}
        />
      ) : null}
    </div>
  )
}

function Action({
  icon: Icon,
  label,
  count = 0,
  pressed,
  onPress,
}: {
  icon: LucideIcon
  label: string
  count?: number
  pressed?: boolean
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      aria-pressed={pressed}
      className="flex h-9 items-center gap-1.5 rounded-full px-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
    >
      <Icon
        className={cn("size-6", pressed && "fill-current text-foreground")}
      />
      {count > 0 ? (
        <Bump value={count}>
          <span className="text-sm font-bold">{compactCount(count)}</span>
        </Bump>
      ) : null}
    </button>
  )
}
