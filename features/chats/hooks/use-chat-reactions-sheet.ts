"use client"

import { useState } from "react"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listChatReactors } from "../api"
import type { ChatMessage } from "../types"
import { chatKeys } from "../utils/keys"

/** The snacc reactions sheet, fed by a room message. The counts come from the message in the
 * thread, so they move with it; only the names are fetched. */
export function useChatReactionsSheet(messages: ChatMessage[]) {
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<string | null>(null)
  const viewing = messages.find((message) => message.id === viewingId) ?? null

  const reactors = useInfiniteList(
    chatKeys.reactors(viewingId ?? "", filter),
    (page) => listChatReactors(viewingId ?? "", filter ?? undefined, page),
    { enabled: viewingId !== null && open }
  )

  return {
    onOpen(message: ChatMessage) {
      setViewingId(message.id)
      setFilter(null)
      setOpen(true)
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      total:
        viewing?.reactions.reduce((sum, reaction) => sum + reaction.count, 0) ??
        0,
      filter,
      tallies: viewing?.reactions ?? [],
      reactors: reactors.items,
      loading: reactors.loading,
      loadingMore: reactors.loadingMore,
      loadMore: reactors.loadMore,
      filterBy: setFilter,
    },
  }
}
