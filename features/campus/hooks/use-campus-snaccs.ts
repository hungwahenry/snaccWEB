"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listCampusSnaccs } from "../api"

export function useCampusSnaccs(slug: string) {
  const { items, ...list } = useInfiniteList(snaccKeys.campus(slug), (page) =>
    listCampusSnaccs(slug, page)
  )
  return { snaccs: items, ...list }
}
