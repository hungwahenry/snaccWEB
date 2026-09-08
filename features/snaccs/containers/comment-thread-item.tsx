"use client"

import { useReplies } from "@/features/snaccs/hooks/thread/use-replies"
import type { Snacc } from "@/features/snaccs/types"
import type { SnaccActionHandlers } from "@/features/snaccs/components/card/snacc-card"
import { CommentThread } from "@/features/snaccs/components/thread/comment-thread"

type CommentThreadItemProps = SnaccActionHandlers & {
  comment: Snacc
  votingPollFor: string | null
}

export function CommentThreadItem({
  comment,
  votingPollFor,
  ...actions
}: CommentThreadItemProps) {
  const replies = useReplies(comment)

  return (
    <CommentThread
      comment={comment}
      replies={replies.replies}
      addresseeOf={replies.addressee}
      repliesOpen={replies.open}
      remaining={replies.remaining}
      busy={replies.loading || replies.loadingMore}
      onShowReplies={replies.show}
      onMoreReplies={replies.more}
      onHideReplies={replies.hide}
      votingPollFor={votingPollFor}
      {...actions}
    />
  )
}
