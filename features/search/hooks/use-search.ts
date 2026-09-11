"use client"

import { useMemo } from "react"
import { usePeopleList } from "@/features/follows/hooks/use-people-list"
import { followKeys } from "@/features/follows/utils/keys"
import type { Hashtag } from "@/features/hashtags/types"
import { uniqueHashtags } from "@/features/hashtags/utils/unique"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { listUniversities } from "@/features/universities/api"
import type { University } from "@/features/universities/types"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { searchHashtags, searchSnaccs, searchUsers } from "../api"
import { searchKeys } from "../utils/keys"

export function useSearchUsers(q: string, enabled = true) {
  return usePeopleList(followKeys.search(q), (page) => searchUsers(q, page), {
    enabled: enabled && q.length > 0,
  })
}

export function useSearchSnaccs(q: string, enabled = true) {
  const { items, ...list } = useInfiniteList(
    snaccKeys.search(q),
    (page) => searchSnaccs(q, page),
    { enabled: enabled && q.length > 0 }
  )
  return { snaccs: items, ...list }
}

export function useSearchHashtags(q: string, enabled = true) {
  const { items, ...list } = useInfiniteList<Hashtag>(
    searchKeys.hashtags(q),
    (page) => searchHashtags(q, page),
    { enabled: enabled && q.length > 0 }
  )
  const hashtags = useMemo(() => uniqueHashtags(items), [items])
  return { hashtags, ...list }
}

export function useSearchCampuses(q: string, enabled = true) {
  const { items, ...list } = useInfiniteList<University>(
    searchKeys.campuses(q),
    (page) => listUniversities({ search: q, page }),
    { enabled: enabled && q.length > 0 }
  )
  return { campuses: items, ...list }
}
