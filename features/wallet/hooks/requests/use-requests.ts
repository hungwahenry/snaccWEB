"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listRequests } from "../../api"
import type { RequestBox } from "../../types"
import { walletKeys } from "../../utils/keys"

export function useRequests(
  box: RequestBox,
  options: { enabled?: boolean } = {}
) {
  return useInfiniteList(
    walletKeys.requests(box),
    (page) => listRequests(box, page),
    options
  )
}
