import type { PaginatedPages } from "@/lib/api/types"
import { getQueryClient } from "@/lib/query/client"
import { filterItems, findItem, mapItems, prependItem } from "@/lib/query/pages"
import type { Conversation, Message } from "../types"
import { messageKeys } from "../utils/keys"

type MessagePages = PaginatedPages<Message>
type ConversationPages = PaginatedPages<Conversation>

const client = () => getQueryClient()

function readThread(conversationId: string): MessagePages | undefined {
  return client().getQueryData<MessagePages>(messageKeys.thread(conversationId))
}

function changeThread(
  conversationId: string,
  change: (data: MessagePages | undefined) => MessagePages | undefined
): void {
  client().setQueryData<MessagePages>(
    messageKeys.thread(conversationId),
    change
  )
}

/** The inbox orders and previews by the latest message, so any change to a thread refreshes it. */
export function inboxChanged(): void {
  void client().invalidateQueries({ queryKey: messageKeys.conversationLists() })
}

export function unreadChanged(): void {
  void client().invalidateQueries({ queryKey: messageKeys.unread() })
}

export function findMessage(
  conversationId: string,
  id: string
): Message | undefined {
  return findItem(readThread(conversationId), (message) => message.id === id)
}

/** Puts a message at the bottom of the thread, or updates it in place if it is already there. */
export function prependMessage(conversationId: string, message: Message): void {
  changeThread(conversationId, (data) =>
    findItem(data, (m) => m.id === message.id)
      ? mapItems(data, (m) => (m.id === message.id ? message : m))
      : prependItem(data, message)
  )
  inboxChanged()
}

export function swapMessage(
  conversationId: string,
  id: string,
  message: Message
): void {
  changeThread(conversationId, (data) =>
    mapItems(data, (m) => (m.id === id ? message : m))
  )
  inboxChanged()
}

export function replaceMessage(conversationId: string, message: Message): void {
  swapMessage(conversationId, message.id, message)
}

export function patchMessage(
  conversationId: string,
  id: string,
  patch: (message: Message) => Message
): void {
  changeThread(conversationId, (data) =>
    mapItems(data, (m) => (m.id === id ? patch(m) : m))
  )
}

export function removeMessage(conversationId: string, id: string): void {
  changeThread(conversationId, (data) => filterItems(data, (m) => m.id !== id))
  inboxChanged()
}

/** Settles a sent message; drops the stand-in if the real one already arrived over the socket. */
export function settleMessage(
  conversationId: string,
  sentId: string,
  real: Message
): void {
  if (sentId !== real.id && findMessage(conversationId, real.id)) {
    removeMessage(conversationId, sentId)
    return
  }
  swapMessage(conversationId, sentId, real)
}

export function markPhotoOpened(conversationId: string, photoId: string): void {
  changeThread(conversationId, (data) =>
    mapItems(data, (message) =>
      message.images.some((image) => image.id === photoId)
        ? {
            ...message,
            images: message.images.map((image) =>
              image.id === photoId ? { ...image, opened: true } : image
            ),
          }
        : message
    )
  )
}

export function setConversation(conversation: Conversation): void {
  client().setQueryData(messageKeys.conversation(conversation.id), conversation)
  inboxChanged()
}

export function conversationChanged(id: string): void {
  void client().invalidateQueries({ queryKey: messageKeys.conversation(id) })
  inboxChanged()
}

export function setPeerRead(conversationId: string, readAt: string): void {
  client().setQueryData<Conversation>(
    messageKeys.conversation(conversationId),
    (current) => (current ? { ...current, peer_read_at: readAt } : current)
  )
}

/** Clears a thread's unread mark everywhere it shows, and takes it off the unread count at once. */
export function markConversationSeen(conversationId: string): void {
  const queryClient = client()
  const lists = queryClient.getQueriesData<ConversationPages>({
    queryKey: messageKeys.conversationLists(),
  })
  const wasUnread =
    queryClient.getQueryData<Conversation>(
      messageKeys.conversation(conversationId)
    )?.has_unread === true ||
    lists.some(
      ([, data]) =>
        findItem(data, (c) => c.id === conversationId)?.has_unread === true
    )

  const seen = (c: Conversation) =>
    c.id === conversationId && c.has_unread ? { ...c, has_unread: false } : c

  queryClient.setQueriesData<ConversationPages>(
    { queryKey: messageKeys.conversationLists() },
    (data) => mapItems(data, seen)
  )
  queryClient.setQueryData<Conversation>(
    messageKeys.conversation(conversationId),
    (current) => current && seen(current)
  )

  if (wasUnread) {
    queryClient.setQueryData<number>(messageKeys.unread(), (count) =>
      count === undefined ? count : Math.max(0, count - 1)
    )
  }
}
