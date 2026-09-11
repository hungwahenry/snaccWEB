"use client"

import { useEffect, useMemo, useRef, type RefObject } from "react"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { isNotFound } from "@/lib/api/errors"
import { useLightbox } from "@/providers/lightbox-provider"
import type { MessageRowHandlers } from "../components/thread/message-row"
import { discardMessage, retryMessage } from "../cache/pending-messages"
import { shownImagesOf } from "../utils/images"
import { partyName } from "../utils/preview"
import { decorateThread } from "../utils/thread"
import { useConversation } from "./use-conversation"
import { useConversationComposer } from "./use-conversation-composer"
import { useConversationMenu } from "./use-conversation-menu"
import { useConversationMoney } from "./use-conversation-money"
import { useMarkRead } from "./use-mark-read"
import { useReactToMessage } from "./use-message-actions"
import { useMessageSheet } from "./use-message-sheet"
import { useMessages } from "./use-messages"
import { useThreadScroll } from "./use-thread-scroll"
import { useTyping } from "./use-typing"
import { useViewOncePhoto } from "./use-view-once-photo"

type Elements = {
  scrollRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLTextAreaElement | null>
}

export function useConversationScreen(
  id: string,
  { scrollRef, inputRef }: Elements
) {
  const conversation = useConversation(id)
  const messages = useMessages(id)
  const report = useReportSheet()
  const lightbox = useLightbox()
  const photo = useViewOncePhoto(id)
  const react = useReactToMessage(id)

  const data = conversation.data ?? null
  const other = data?.other ?? null
  const menu = useConversationMenu(id, other, report)
  const money = useConversationMoney(id, other?.username ?? null)

  const newest = messages.messages[0]
  const oldest = messages.messages.at(-1)
  const thread = useMemo(
    () =>
      decorateThread(messages.messages, messages.hasMore ?? false, {
        peerReadAt: data?.peer_read_at ?? null,
      }),
    [messages.messages, messages.hasMore, data?.peer_read_at]
  )

  useMarkRead(id, messages.messages.length)
  const { typing, notifyTyping } = useTyping(id, newest?.id)
  const scroll = useThreadScroll(scrollRef, {
    newestId: newest?.id,
    oldestId: oldest?.id,
    ready: !messages.loading,
  })

  const composer = useConversationComposer(id, {
    conversation: data,
    inputRef,
    extraActions: money.actions,
    onType: notifyTyping,
    onSent: scroll.scrollToBottom,
  })

  const sheet = useMessageSheet(id, {
    onReply: composer.startReply,
    onEdit: composer.startEdit,
    onReport: report.open,
  })

  // One handler object for the whole thread, so memoised rows never re-render for a new closure.
  const latest = useRef({ react, composer, sheet, photo, lightbox, money })
  useEffect(() => {
    latest.current = { react, composer, sheet, photo, lightbox, money }
  })
  const handlers = useMemo<MessageRowHandlers>(
    () => ({
      onReact: (message, emoji) => latest.current.react(message, emoji),
      onOpenActions: (message) => latest.current.sheet.openFor(message),
      onReply: (message) => latest.current.composer.startReply(message),
      onRetry: (message) => retryMessage(id, message.id),
      onDiscard: (message) => discardMessage(id, message.id),
      onOpenViewOnce: (message, image) =>
        latest.current.photo.open({ messageId: message.id, photo: image }),
      onOpenImages: (message, index) =>
        latest.current.lightbox.open({ images: shownImagesOf(message), index }),
      onOpenMoney: (transactionId) =>
        latest.current.money.openReceipt(transactionId),
      onPayRequest: (request) => latest.current.money.payRequest(request),
    }),
    [id]
  )

  return {
    conversation: data,
    notAvailable: conversation.isError && isNotFound(conversation.error),
    failed: conversation.isError && !isNotFound(conversation.error),
    retry: () => void conversation.refetch(),
    other,
    title: data ? partyName(data) : "",
    otherUsername: other?.username ?? null,
    messages,
    thread,
    typing,
    onScroll: scroll.onScroll,
    handlers,
    openingPhotoId: photo.openingId,
    payingRequestIds: money.payingRequestIds,
    requestExpiryDays: money.requestExpiryDays,
    viewOnce: { url: photo.url, onClose: photo.close },
    composer: composer.field,
    stickerTray: composer.stickerTray,
    stickerCreator: composer.stickerCreator,
    actions: sheet.sheet,
    menu,
    report: report.sheet,
    moneyDetail: money.detailSheet,
  }
}
