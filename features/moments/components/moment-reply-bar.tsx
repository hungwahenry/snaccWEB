"use client"

import { LikeIcon } from "@/features/likes/components/like-icon"
import { useOptimisticLike } from "@/features/likes/hooks/use-optimistic-like"
import { MomentReplyComposer } from "../containers/moment-reply-composer"

const LIKE_SIZE = 28

type MomentLikeProps = {
  liked: boolean
  onSetLike: (liked: boolean) => Promise<void>
}

export function MomentReplyBar({
  momentId,
  liked,
  onSetLike,
  onReply,
  onFocus,
  onBlur,
}: MomentLikeProps & {
  momentId: string
  onReply: (body: string) => void
  onFocus: () => void
  onBlur: () => void
}) {
  return (
    <div className="flex items-end">
      <div className="min-w-0 flex-1">
        <MomentReplyComposer
          onReply={onReply}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      <MomentLike key={momentId} liked={liked} onSetLike={onSetLike} />
    </div>
  )
}

function MomentLike({ liked, onSetLike }: MomentLikeProps) {
  const like = useOptimisticLike({ liked, onSet: onSetLike })

  return (
    <button
      type="button"
      onClick={like.toggle}
      aria-label={like.liked ? "Unlike" : "Like"}
      aria-pressed={like.liked}
      className="mr-3 mb-[max(env(safe-area-inset-bottom),8px)] flex h-14 items-center justify-center text-white transition-opacity active:opacity-70"
    >
      <LikeIcon liked={like.liked} size={LIKE_SIZE} />
    </button>
  )
}
