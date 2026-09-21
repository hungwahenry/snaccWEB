"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listHangoutSnaccs } from "../../api"

export function useHangoutSnaccs(snaccId: string) {
  return useInfiniteList(snaccKeys.hangout(snaccId), (page) =>
    listHangoutSnaccs(snaccId, page)
  )
}
