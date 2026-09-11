"use client"

import { useEffect, useMemo, useRef, type RefObject } from "react"
import { useThreadScroll } from "@/features/messages/hooks/use-thread-scroll"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { useLightbox } from "@/providers/lightbox-provider"
import {
  discardChatMessage,
  retryChatMessage,
} from "../cache/pending-chat-messages"
import type { ChatMessageRowHandlers } from "../components/chat-message-row"
import { roomSubtitle, roomTitle } from "../utils/rooms"
import { useReactToChatMessage } from "./use-chat-actions"
import { useChatComposer } from "./use-chat-composer"
import { useChatMessageSheet } from "./use-chat-message-sheet"
import { useChatReactionsSheet } from "./use-chat-reactions-sheet"
import { useChatRooms } from "./use-chat-rooms"
import { useChatThread } from "./use-chat-thread"
import { useChatTyping } from "./use-chat-typing"
import { useMuteChatRoom } from "./use-mute-chat-room"

type Elements = {
  scrollRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLTextAreaElement | null>
}

export function useChatRoomScreen(
  roomId: string,
  { scrollRef, inputRef }: Elements
) {
  const rooms = useChatRooms()
  const room = rooms.data?.find((each) => each.id === roomId) ?? null
  const { messages, items } = useChatThread(roomId)
  const typing = useChatTyping(roomId)
  const react = useReactToChatMessage(roomId)
  const mute = useMuteChatRoom(roomId)
  const report = useReportSheet()
  const lightbox = useLightbox()
  const reactions = useChatReactionsSheet(messages.messages)

  const scroll = useThreadScroll(scrollRef, {
    newestId: messages.messages[0]?.id,
    oldestId: messages.messages.at(-1)?.id,
    ready: !messages.loading,
  })

  const composer = useChatComposer(roomId, {
    inputRef,
    onType: typing.signal,
    onSent: scroll.scrollToBottom,
  })

  const sheet = useChatMessageSheet(roomId, {
    onReply: composer.startReply,
    onEdit: composer.startEdit,
    onSeeReactions: reactions.onOpen,
    onReport: report.open,
  })

  // One handler object for the whole room, so memoised rows never re-render for a new closure.
  const latest = useRef({ react, composer, sheet, lightbox })
  useEffect(() => {
    latest.current = { react, composer, sheet, lightbox }
  })
  const handlers = useMemo<ChatMessageRowHandlers>(
    () => ({
      onReact: (message, emoji) => latest.current.react(message, emoji),
      onOpenActions: (message) => latest.current.sheet.openFor(message),
      onReply: (message) => latest.current.composer.startReply(message),
      onRetry: (message) => retryChatMessage(roomId, message.id),
      onDiscard: (message) => discardChatMessage(roomId, message.id),
      onOpenImages: (message, index) =>
        latest.current.lightbox.open({ images: message.images, index }),
    }),
    [roomId]
  )

  return {
    room,
    title: roomTitle(room),
    subtitle: roomSubtitle(room),
    muted: room?.muted ?? false,
    onToggleMuted: () => mute(!(room?.muted ?? false)),
    canPost: !room?.locked,
    messages,
    thread: items,
    typingLabel: typing.label,
    onScroll: scroll.onScroll,
    handlers,
    composer: composer.field,
    stickerTray: composer.stickerTray,
    stickerCreator: composer.stickerCreator,
    actions: sheet.sheet,
    reactions: reactions.sheet,
    report: report.sheet,
  }
}
