"use client"

import { useState } from "react"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listComments } from "../../api"
import type { Snacc } from "../../types"
import { snaccKeys } from "../../utils/keys"
import { REPLY_SORT } from "../../utils/sorts"
import { addresseeOf, repliesLeft } from "../../utils/threads"

export function useReplies(comment: Snacc) {
  const [open, setOpen] = useState(false)

  const { items, total, ...list } = useInfiniteList(
    snaccKeys.comments(comment.id, REPLY_SORT),
    (page) => listComments(comment.id, page, REPLY_SORT),
    { enabled: open, keepPrevious: false }
  )

  const replies = open ? items : []

  return {
    open,
    replies,
    loading: list.loading,
    failed: list.failed,
    loadingMore: list.loadingMore,
    remaining: repliesLeft({
      open,
      shown: replies.length,
      count: comment.comments_count,
      total,
    }),
    show: () => setOpen(true),
    hide: () => setOpen(false),
    more: list.failed && replies.length === 0 ? list.retry : list.loadMore,
    addressee: (reply: Snacc) => addresseeOf(reply, comment.author.id),
  }
}
