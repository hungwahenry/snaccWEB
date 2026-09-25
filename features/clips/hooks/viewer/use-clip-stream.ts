"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listClips } from "../../api/list-clips"
import { useClipScope } from "./use-clip-scope"

export function useClipStream(enabled: boolean) {
  const scope = useClipScope()

  return useInfiniteList(
    snaccKeys.clips(scope),
    (page) => listClips(scope, page),
    { enabled, keepPrevious: false }
  )
}
