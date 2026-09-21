"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listHangouts } from "../../api"
import type { HangoutScope } from "../../types"
import { hangoutKeys } from "../../utils/keys"

export function useHangoutList(scope: HangoutScope) {
  const enabled = useFlag("hangouts")
  const { items, ...list } = useInfiniteList(
    hangoutKeys.list(scope),
    (page) => listHangouts(scope, page),
    { enabled }
  )
  return { cards: items, ...list }
}
