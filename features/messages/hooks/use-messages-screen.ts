"use client"

import { useMemo, useState } from "react"
import { useChatRooms } from "@/features/chats/hooks/use-chat-rooms"
import { chatRoomPath } from "@/features/chats/routes"
import type { ChatRoom } from "@/features/chats/types"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { inboxEntries, pinnedRooms } from "../utils/inbox"
import { isSearch } from "../utils/search"
import { useConversations } from "./use-conversations"
import { useMessageSearch } from "./use-message-search"
import { useStreakIntro } from "./use-streak-intro"

const NO_ROOMS: ChatRoom[] = []

export function useMessagesScreen() {
  const [searchActive, setSearchActive] = useState(false)
  const [query, setQuery] = useState("")
  const search = useDebouncedValue(query.trim(), 300)
  const searching = searchActive && isSearch(search)

  const dmsEnabled = useFlagWhenKnown("anon_messages")
  const rooms = useChatRooms()
  const feed = useConversations(searching ? search : "")
  const hits = useMessageSearch(dmsEnabled && searching ? search : "")
  const streakIntro = useStreakIntro()

  const shownRooms = searchActive ? NO_ROOMS : (rooms.data ?? NO_ROOMS)
  const entries = useMemo(
    () => inboxEntries(feed.conversations, shownRooms, !feed.hasMore),
    [feed.conversations, shownRooms, feed.hasMore]
  )
  const pinned = useMemo(() => pinnedRooms(shownRooms), [shownRooms])

  const matches = searching ? (hits.data?.items ?? []) : []

  return {
    dmsEnabled,
    search: dmsEnabled
      ? {
          active: searchActive,
          open: () => setSearchActive(true),
          close: () => {
            setQuery("")
            setSearchActive(false)
          },
        }
      : null,
    query,
    setQuery,
    searching,
    feed,
    entries,
    pinned,
    roomsLoading: rooms.isLoading,
    hrefOf: (room: ChatRoom) => chatRoomPath(room.id),
    matches,
    showPeople: searching && feed.conversations.length > 0,
    nothingFound:
      searching &&
      !hits.isPending &&
      feed.conversations.length === 0 &&
      matches.length === 0,
    searchingMessages: searching && hits.isPending,
    streakIntro: streakIntro.sheet,
  }
}
