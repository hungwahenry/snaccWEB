import { getQueryClient } from "@/lib/query-client"
import type { InfiniteData } from "@tanstack/react-query"
import type { Paginated } from "@/lib/api/types"
import { chatMessagesKey } from "./keys"
import type { ChatMessage } from "./types"

type Pages = InfiniteData<Paginated<ChatMessage>>

/// History is newest-first, so a new message belongs at the head of the first page. Dropping an
/// id that is already there keeps the optimistic copy from doubling when the socket echoes it.
export function upsertChatMessage(roomId: string, message: ChatMessage): void {
  getQueryClient().setQueryData<Pages>(chatMessagesKey(roomId), (data) => {
    if (!data) return data

    const without = data.pages.map((page) => ({
      ...page,
      items: page.items.filter((item) => item.id !== message.id),
    }))
    const [first, ...rest] = without
    if (!first) return data

    return { ...data, pages: [{ ...first, items: [message, ...first.items] }, ...rest] }
  })
}

export function replaceChatMessage(roomId: string, message: ChatMessage): void {
  getQueryClient().setQueryData<Pages>(chatMessagesKey(roomId), (data) =>
    data
      ? {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.id === message.id ? message : item)),
          })),
        }
      : data
  )
}
