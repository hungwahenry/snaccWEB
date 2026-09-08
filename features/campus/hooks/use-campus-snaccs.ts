"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listCampusSnaccs } from "../api"

export function useCampusSnaccs(slug: string) {
  const { items, ...list } = useInfiniteList(
    ["universities", slug.toLowerCase(), "snaccs"],
    (page) => listCampusSnaccs(slug, page)
  )
  return { snaccs: items, ...list }
}
