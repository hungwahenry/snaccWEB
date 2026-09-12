"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listScheduled } from "../../api"
import { snaccKeys } from "../../utils/keys"

export function useScheduledSnaccs(options: { enabled?: boolean } = {}) {
  const { items, ...list } = useInfiniteList(
    snaccKeys.scheduled(),
    listScheduled,
    { enabled: options.enabled }
  )
  return { scheduled: items, ...list }
}
