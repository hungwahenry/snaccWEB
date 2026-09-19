"use client"

import { useState } from "react"
import { lastFeedScope } from "@/features/feed/scope-memory"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listClips } from "../../api/list-clips"

export function useClipStream(enabled: boolean) {
  const [scope] = useState(lastFeedScope)

  return useInfiniteList(
    snaccKeys.clips(scope),
    (page) => listClips(scope, page),
    { enabled, keepPrevious: false }
  )
}
