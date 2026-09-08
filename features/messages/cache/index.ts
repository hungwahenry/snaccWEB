import type { Paginated } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query-client"
import type { InfiniteData } from "@tanstack/react-query"
import type { Message } from "../types"
import { CONVERSATIONS_KEY, messagesKey } from "../utils/keys"

type MessagePages = InfiniteData<Paginated<Message>>

const client = () => getQueryClient()

function patchThread(
  conversationId: string,
  patch: (data: MessagePages) => MessagePages
): void {
  client().setQueryData<MessagePages>(messagesKey(conversationId), (data) =>
    data ? patch(data) : data
  )
}

function refreshList(): void {
  void client().invalidateQueries({ queryKey: CONVERSATIONS_KEY })
}

export function prependMessage(conversationId: string, message: Message): void {
  patchThread(conversationId, (data) => {
    if (
      data.pages.some((page) => page.items.some((m) => m.id === message.id))
    ) {
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map((m) => (m.id === message.id ? message : m)),
        })),
      }
    }
    return {
      ...data,
      pages: data.pages.map((page, index) =>
        index === 0
          ? { ...page, items: [message, ...page.items], total: page.total + 1 }
          : page
      ),
    }
  })
  refreshList()
}

export function swapMessage(
  conversationId: string,
  id: string,
  message: Message
): void {
  patchThread(conversationId, (data) => ({
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((m) => (m.id === id ? message : m)),
    })),
  }))
  refreshList()
}

export function replaceMessage(conversationId: string, message: Message): void {
  swapMessage(conversationId, message.id, message)
}

export function patchMessage(
  conversationId: string,
  id: string,
  patch: (message: Message) => Message
): void {
  patchThread(conversationId, (data) => ({
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((m) => (m.id === id ? patch(m) : m)),
    })),
  }))
}

export function markPhotoOpened(conversationId: string, photoId: string): void {
  patchThread(conversationId, (data) => ({
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((message) =>
        message.images.some((image) => image.id === photoId)
          ? {
              ...message,
              images: message.images.map((image) =>
                image.id === photoId ? { ...image, opened: true } : image
              ),
            }
          : message
      ),
    })),
  }))
}

function pages(conversationId: string): MessagePages | undefined {
  return client().getQueryData<MessagePages>(messagesKey(conversationId))
}

export function findMessage(
  conversationId: string,
  id: string
): Message | undefined {
  return pages(conversationId)
    ?.pages.flatMap((page) => page.items)
    .find((message) => message.id === id)
}

function hasMessage(conversationId: string, id: string): boolean {
  return Boolean(
    pages(conversationId)?.pages.some((page) =>
      page.items.some((m) => m.id === id)
    )
  )
}

export function settleMessage(
  conversationId: string,
  sentId: string,
  real: Message
): void {
  if (sentId !== real.id && hasMessage(conversationId, real.id)) {
    removeMessage(conversationId, sentId)
    return
  }
  swapMessage(conversationId, sentId, real)
}

export function removeMessage(conversationId: string, id: string): void {
  patchThread(conversationId, (data) => ({
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter((m) => m.id !== id),
      total: Math.max(0, page.total - 1),
    })),
  }))
  refreshList()
}
