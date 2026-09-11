"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listComments } from "../../api"
import type { CommentSort } from "../../types"
import { snaccKeys } from "../../utils/keys"
import { DEFAULT_COMMENT_SORT } from "../../utils/sorts"

export function useComments(
  snaccId: string,
  sort: CommentSort = DEFAULT_COMMENT_SORT,
  options: { enabled?: boolean } = {}
) {
  const { items, ...list } = useInfiniteList(
    snaccKeys.comments(snaccId, sort),
    (page) => listComments(snaccId, page, sort),
    {
      enabled: options.enabled,
    }
  )
  return { comments: items, ...list }
}
