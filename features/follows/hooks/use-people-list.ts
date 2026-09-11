"use client"

import type { QueryKey } from "@tanstack/react-query"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import type { Paginated } from "@/lib/api/types"
import type { FollowUser } from "../types"
import { useFollowToggle } from "./use-follow-toggle"

/** A paged list of people, each with a Follow button that stays in step everywhere. */
export function usePeopleList(
  key: QueryKey,
  fetchPage: (page: number) => Promise<Paginated<FollowUser>>,
  options?: { enabled?: boolean }
) {
  const { items, ...list } = useInfiniteList<FollowUser>(
    key,
    fetchPage,
    options
  )
  const onToggleFollow = useFollowToggle()

  return { users: items, onToggleFollow, ...list }
}
