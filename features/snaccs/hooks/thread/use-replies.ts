"use client"

import { useState } from "react"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listComments } from "../../api"
import type { Snacc } from "../../types"
import { REPLY_SORT } from "../../utils/sorts"
import { addresseeOf } from "../../utils/threads"

export function useReplies(comment: Snacc) {
  const [open, setOpen] = useState(false)

  const { items, total, ...list } = useInfiniteList(
    ["snaccs", comment.id, "comments", REPLY_SORT],
    (page) => listComments(comment.id, page, REPLY_SORT),
    { enabled: open }
  )

  const replies = open ? items : []

  return {
    open,
    replies,
    loading: list.loading,
    failed: list.failed,
    loadingMore: list.loadingMore,
    remaining: Math.max(0, (total ?? comment.comments_count) - replies.length),
    show: () => setOpen(true),
    hide: () => setOpen(false),
    more: list.loadMore,
    addressee: (reply: Snacc) => addresseeOf(reply, comment.author.id),
  }
}
