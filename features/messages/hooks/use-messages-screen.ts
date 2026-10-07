"use client"

import { useState } from "react"
import { useChatRooms } from "@/features/chats/hooks/use-chat-rooms"
import { useRoomsEnabled } from "@/features/chats/hooks/use-rooms-enabled"
import { chatRoomPath } from "@/features/chats/routes"
import type { ChatRoom } from "@/features/chats/types"
import { unreadRoomCount } from "@/features/chats/utils/rooms"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { isSearch } from "../utils/search"
import { useConversations } from "./use-conversations"
import { useMessageSearch } from "./use-message-search"
import { useStreakIntro } from "./use-streak-intro"

export type InboxTab = "dms" | "rooms"

export function useMessagesScreen() {
  const [tab, setTab] = useState<InboxTab>("dms")
  const [searchActive, setSearchActive] = useState(false)
  const [query, setQuery] = useState("")
  const search = useDebouncedValue(query.trim(), 300)
  const searching = searchActive && isSearch(search)

  const dmsEnabled = useFlagWhenKnown("anon_messages")
  const roomsEnabled = useRoomsEnabled()
  const rooms = useChatRooms()
  const feed = useConversations(searching ? search : "")
  const hits = useMessageSearch(dmsEnabled && searching ? search : "")
  const streakIntro = useStreakIntro()

  const matches = searching ? (hits.data?.items ?? []) : []
  // With DMs off, the rooms are all there is, so there is nothing to switch between.
  const shown: InboxTab = dmsEnabled === false ? "rooms" : tab

  return {
    title: !roomsEnabled ? "DMs" : dmsEnabled === false ? "Rooms" : "Messages",
    tabs:
      roomsEnabled && dmsEnabled && !searchActive
        ? {
            value: tab,
            onChange: setTab,
            unreadRooms: unreadRoomCount(rooms.data),
          }
        : null,
    dmsEnabled,
    showRooms: roomsEnabled && !searchActive && shown === "rooms",
    rooms: {
      rooms: rooms.data ?? [],
      loading: rooms.isLoading,
      failed: rooms.isError,
      onRetry: () => void rooms.refetch(),
      hrefOf: (room: ChatRoom) => chatRoomPath(room.id),
    },
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
