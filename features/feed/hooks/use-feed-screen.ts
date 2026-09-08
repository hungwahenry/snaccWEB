"use client"

import { useCallback, useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { signal } from "@/features/signals/utils/queue"
import { useRealtimeEvent } from "@/hooks/use-realtime-event"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { realtimeRooms } from "@/providers/realtime-rooms"
import type { FeedScope, FeedSort } from "../types"
import {
  DEFAULT_FEED_SCOPE,
  rememberFeedSort,
  rememberedFeedSort,
} from "../utils/scopes"
import { useFeed } from "./use-feed"

export interface NewPoster {
  key: string
  avatarUrl: string | null
}

const POSTERS_SHOWN = 3

export function useFeedScreen() {
  const [scope, setScope] = useState<FeedScope>(DEFAULT_FEED_SCOPE)
  // Lazy so the remembered choice is read once; this screen only ever mounts in the browser.
  const [sort, setSort] = useState<FeedSort>(
    () => rememberedFeedSort() ?? "top"
  )
  const [hasNew, setHasNew] = useState(false)
  const [newPosters, setNewPosters] = useState<NewPoster[]>([])
  const [sortMenuOpen, setSortMenuOpen] = useState(false)

  const followingEnabled = useFlag("feed_following")
  const globalEnabled = useFlag("feed_global")
  const sortable = useFlag("feed_ranking")

  const order: FeedSort = sortable ? sort : "latest"
  const feed = useFeed(scope, order)
  const campusSlug = useMe().data?.profile?.university?.slug

  if (scope === "following" && !followingEnabled) setScope(DEFAULT_FEED_SCOPE)
  if (scope === "global" && !globalEnabled) setScope(DEFAULT_FEED_SCOPE)

  useRealtimeRoom(
    scope === "campus" && campusSlug
      ? realtimeRooms.feedCampus(campusSlug)
      : null
  )

  useRealtimeEvent("feed.snacc", (payload) => {
    if (scope === "following" || order !== "latest") return
    setHasNew(true)

    const event = payload as {
      anonymous?: boolean
      actor_id?: string
      avatar_url?: string | null
    }
    const key = event.anonymous ? "ghost" : event.actor_id
    if (!key) return

    setNewPosters((current) => {
      if (current.some((poster) => poster.key === key)) return current
      return [...current, { key, avatarUrl: event.avatar_url ?? null }].slice(
        -POSTERS_SHOWN
      )
    })
  })

  const clearNew = () => {
    setHasNew(false)
    setNewPosters([])
  }

  const pickScope = useCallback((next: FeedScope) => {
    setSortMenuOpen(false)
    setScope((current) => {
      if (next === current) return current
      signal("feed_scope", { detail: next })
      clearNew()
      return next
    })
  }, [])

  const pickSort = useCallback(
    (next: FeedSort) => {
      setSortMenuOpen(false)
      setSort((current) => {
        if (next === current) return current
        rememberFeedSort(next)
        signal("feed_scope", { detail: `${scope}:${next}` })
        clearNew()
        return next
      })
    },
    [scope]
  )

  const refresh = useCallback(() => {
    clearNew()
    window.scrollTo({ top: 0, behavior: "smooth" })
    feed.refresh()
  }, [feed])

  return {
    scope,
    sort: order,
    sortable,
    hasNew,
    newPosters,
    sortMenuOpen,
    tabs: { following: followingEnabled, global: globalEnabled },
    feed,
    pickScope,
    pickSort,
    openSortMenu: () => setSortMenuOpen(true),
    setSortMenuOpen,
    refresh,
  }
}
