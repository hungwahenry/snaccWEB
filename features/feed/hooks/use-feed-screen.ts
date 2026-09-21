"use client"

import { useCallback, useEffect, useEffectEvent, useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { onNavReselect } from "@/features/navigation/reselect"
import { signal } from "@/features/signals/utils/queue"
import { useRealtimeEvent } from "@/hooks/use-realtime-event"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { rememberFeedScope } from "../scope-memory"
import type { FeedScope, FeedSnaccEvent, NewPoster } from "../types"
import { withNewPoster } from "../utils/new-posters"
import {
  DEFAULT_FEED_SCOPE,
  FEED_EMPTY,
  FEED_FAILED,
  liveFeedRoom,
  resolveScope,
} from "../utils/scopes"
import { useFeed } from "./use-feed"
import { useFeedTabs } from "./use-feed-tabs"

export function useFeedScreen() {
  const [picked, setPicked] = useState<FeedScope>(DEFAULT_FEED_SCOPE)
  const [newPosters, setNewPosters] = useState<NewPoster[] | null>(null)

  const { enabled, tabs, show } = useFeedTabs()

  const scope = resolveScope(picked, enabled)
  const feed = useFeed(scope)
  const campusSlug = useMe().data?.profile?.university?.slug ?? null
  const room = liveFeedRoom(scope, campusSlug)

  useRealtimeRoom(room)
  useRealtimeEvent("feed.snacc", (payload) => {
    if (!room) return
    setNewPosters((current) =>
      withNewPoster(current ?? [], payload as FeedSnaccEvent)
    )
  })

  useEffect(() => rememberFeedScope(scope), [scope])

  const pickScope = useCallback(
    (next: FeedScope) => {
      if (next === scope) return
      signal("feed_scope", { detail: next })
      setNewPosters(null)
      setPicked(next)
    },
    [scope]
  )

  const showNew = () => {
    setNewPosters(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
    feed.refresh()
  }

  const refresh = useEffectEvent(showNew)
  useEffect(() => onNavReselect("home", () => refresh()), [])

  return {
    tabs: {
      show,
      tabs,
      value: scope,
      onChange: pickScope,
      onReselect: () => showNew(),
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
