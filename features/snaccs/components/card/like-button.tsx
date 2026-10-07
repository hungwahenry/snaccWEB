"use client"

import { LikeIcon } from "@/features/likes/components/like-icon"
import { useOptimisticLike } from "@/features/likes/hooks/use-optimistic-like"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"

const ICON_SIZE = 24

type LikeButtonProps = {
  count: number
  liked: boolean
  onSet: (liked: boolean) => Promise<void>
  onOpenLikers: () => void
}

export function LikeButton({
  count,
  liked,
  onSet,
  onOpenLikers,
}: LikeButtonProps) {
  const like = useOptimisticLike({ liked, likesCount: count, onSet })

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={like.toggle}
        aria-label={like.liked ? "Unlike" : "Like"}
        aria-pressed={like.liked}
        className="flex h-9 items-center rounded-full px-1.5 text-muted-foreground transition-colors hover:bg-like/10 hover:text-like active:scale-95"
      >
        <LikeIcon liked={like.liked} size={ICON_SIZE} />
      </button>
      {like.likesCount > 0 ? (
        <button
          type="button"
          onClick={onOpenLikers}
          aria-label="See who liked this"
          className={cn(
            "h-9 rounded-full px-1 text-sm font-bold hover:underline",
            like.liked ? "text-like" : "text-muted-foreground"
          )}
        >
          {compactCount(like.likesCount)}
        </button>
      ) : null}
    </div>
  )
}
