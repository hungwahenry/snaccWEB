"use client"

import { useCallback, useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { signal } from "@/features/signals/utils/queue"
import { useRealtimeEvent } from "@/hooks/use-realtime-event"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import type { FeedScope, FeedSnaccEvent, FeedSort, NewPoster } from "../types"
import { withNewPoster } from "../utils/new-posters"
import {
  DEFAULT_FEED_SCOPE,
  FEED_EMPTY,
  FEED_FAILED,
  liveFeedRoom,
  scopeAllowed,
} from "../utils/scopes"
import { useFeed } from "./use-feed"
import { useFeedSort } from "./use-feed-sort"
import { useFeedTabs } from "./use-feed-tabs"

type SortMenu = { open: boolean; anchor: HTMLElement | null }
const CLOSED: SortMenu = { open: false, anchor: null }

export function useFeedScreen() {
  const [picked, setPicked] = useState<FeedScope>(DEFAULT_FEED_SCOPE)
  const [remembered, rememberSort] = useFeedSort()
  const [newPosters, setNewPosters] = useState<NewPoster[] | null>(null)
  const [sortMenu, setSortMenu] = useState<SortMenu>(CLOSED)

  const { enabled, tabs, sortable, show } = useFeedTabs()

  const scope = scopeAllowed(picked, enabled) ? picked : DEFAULT_FEED_SCOPE
  const sort: FeedSort = sortable ? remembered : "latest"
  const feed = useFeed(scope, sort)
  const campusSlug = useMe().data?.profile?.university?.slug ?? null
  const room = liveFeedRoom(scope, sort, campusSlug)

  useRealtimeRoom(room)
  useRealtimeEvent("feed.snacc", (payload) => {
    if (!room) return
    setNewPosters((current) =>
      withNewPoster(current ?? [], payload as FeedSnaccEvent)
    )
  })

  const pickScope = useCallback(
    (next: FeedScope) => {
      setSortMenu(CLOSED)
      if (next === scope) return
      signal("feed_scope", { detail: next })
      setNewPosters(null)
      setPicked(next)
    },
    [scope]
  )

  const pickSort = useCallback(
    (next: FeedSort) => {
      setSortMenu(CLOSED)
      if (next === sort) return
      signal("feed_scope", { detail: `${scope}:${next}` })
      setNewPosters(null)
      rememberSort(next)
    },
    [scope, sort, rememberSort]
  )

  const openSortMenu = useCallback(
    (_: FeedScope, anchor: HTMLElement) => setSortMenu({ open: true, anchor }),
    []
  )
  const closeSortMenu = useCallback(() => setSortMenu(CLOSED), [])

  const showNew = () => {
    setNewPosters(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
    feed.refresh()
  }

  return {
    tabs: {
      show,
      tabs,
      value: scope,
      onChange: pickScope,
      onReselect: sortable ? openSortMenu : undefined,
    },
    sortMenu: {
      open: sortMenu.open,
      anchor: sortMenu.anchor,
      value: sort,
      onSelect: pickSort,
      onDismiss: closeSortMenu,
    },
    newPill: newPosters ? { posters: newPosters, onPress: showNew } : null,
    list: {
      feed: { ...feed, loading: feed.loading || feed.stale },
      failedTitle: FEED_FAILED[scope],
      empty: FEED_EMPTY[scope],
      findPeople: scope === "following",
    },
  }
}
