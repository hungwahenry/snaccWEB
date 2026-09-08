"use client"

import { useCallback, useMemo, useState, type RefObject } from "react"
import { confirm } from "@/components/ui/confirm"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useGifPicker } from "@/features/giphy/hooks/use-gif-picker"
import { useLightbox } from "@/providers/lightbox-provider"
import { useReportSheet } from "@/features/reports/hooks/use-report-sheet"
import { isNotFound } from "@/lib/api/errors"
import {
  discardMessage,
  retryMessage,
  submitMessage,
} from "../cache/pending-messages"
import type { Message, MessageImage } from "../types"
import { canDeleteMessage, canEditMessage } from "../utils/editing"
import { shownImagesOf } from "../utils/images"
import { partyName } from "../utils/preview"
import { decorateThread } from "../utils/thread"
import { useConversation } from "./use-conversation"
import { useConversationMenu } from "./use-conversation-menu"
import { useMarkRead } from "./use-mark-read"
import { useMessageAttachments } from "./use-message-attachments"
import {
  useDeleteMessage,
  useEditMessage,
  useReactToMessage,
} from "./use-message-actions"
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
  const edit = useEditMessage(id)
  const remove = useDeleteMessage(id)
  const react = useReactToMessage(id)
  const lightbox = useLightbox()
  const editWindowMinutes = useConfigValue(
    "content.message.edit_window_minutes"
  )
  const editingEnabled = useFlag("message_editing")
  const gifsEnabled = useFlag("message_gifs")

  const [active, setActive] = useState<Message | null>(null)
  const [actionsOpen, setActionsOpen] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editing, setEditing] = useState<Message | null>(null)
  const attachments = useMessageAttachments()
  const photo = useViewOncePhoto(id)

  const newest = messages.messages[0] ?? null
  const oldest = messages.messages[messages.messages.length - 1] ?? null
  const thread = useMemo(
    () => decorateThread(messages.messages, messages.hasMore ?? false),
    [messages.messages, messages.hasMore]
  )
  useMarkRead(id, messages.messages.length)
  const { typing, notifyTyping } = useTyping(id, newest?.id)
  const scroll = useThreadScroll(scrollRef, {
    newestId: newest?.id,
    oldestId: oldest?.id,
    ready: !messages.loading,
  })

  const data = conversation.data
  const other = data?.other ?? null
  const menu = useConversationMenu(id, other, report)

  const gifPicker = useGifPicker((gif) => {
    submitMessage(id, { body: null, images: [], replyingTo, gif })
    setReplyingTo(null)
    scroll.scrollToBottom()
  })

  const focusComposer = () => inputRef.current?.focus()

  function onSubmit(body: string) {
    if (editing) {
      edit.mutate({ messageId: editing.id, body })
      setEditing(null)
      return
    }
    const once =
      attachments.viewOnceEnabled &&
      attachments.viewOnce &&
      attachments.draft.length === 1
    submitMessage(id, {
      body: body || null,
      images: attachments.draft,
      replyingTo,
      viewOnce: once,
    })
    setReplyingTo(null)
    attachments.reset()
    scroll.scrollToBottom()
  }

  const onStartReply = useCallback((message: Message) => {
    setActionsOpen(false)
    setEditing(null)
    setReplyingTo(message)
    focusComposer()
  }, [])

  const onOpenActions = useCallback((message: Message) => {
    setActive(message)
    setActionsOpen(true)
  }, [])

  const onOpenImages = useCallback(
    (message: Message, index: number) =>
      lightbox.open({ images: shownImagesOf(message), index }),
    [lightbox]
  )

  const onOpenViewOnce = useCallback(
    (message: Message, image: MessageImage) =>
      photo.open({ messageId: message.id, photo: image }),
    [photo.open] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return {
    conversation: data ?? null,
    notAvailable: conversation.isError && isNotFound(conversation.error),
    failed: conversation.isError && !isNotFound(conversation.error),
    retry: () => void conversation.refetch(),
    other,
    title: data ? partyName(data) : "",
    otherUsername: other?.username ?? null,
    messages,
    thread,
    newest,
    seen: Boolean(
      newest?.mine &&
      data?.peer_read_at != null &&
      newest.created_at <= data.peer_read_at
    ),
    typing,
    notifyTyping,

    onScroll: scroll.onScroll,

    replyingTo,
    editing,
    draft: attachments.draft,
    viewOnce: attachments.viewOnce,
    onToggleViewOnce: attachments.viewOnceEnabled
      ? attachments.onToggleViewOnce
      : undefined,
    maxImages: attachments.maxImages,
    onAddImages: attachments.onAddImages,
    onRemoveImage: attachments.onRemoveImage,
    gifPicker: gifsEnabled ? gifPicker : null,

    sending: edit.isPending,
    onSubmit,
    onReact: react.onReact,
    onStartReply,
    onCancelReply: () => setReplyingTo(null),
    onCancelEdit: () => setEditing(null),
    onOpenActions,
    onOpenImages,
    onOpenViewOnce,
    openingViewOnce: photo.opening,
    viewOnceUrl: photo.url,
    onCloseViewOnce: photo.close,
    onRetryMessage: useCallback(
      (message: Message) => retryMessage(id, message.id),
      [id]
    ),
    onDiscardMessage: useCallback(
      (message: Message) => discardMessage(id, message.id),
      [id]
    ),

    actions: {
      open: actionsOpen,
      onOpenChange: setActionsOpen,
      message: active,
      canEdit: active
        ? editingEnabled && canEditMessage(active, editWindowMinutes)
        : false,
      canDelete: active ? canDeleteMessage(active) : false,
      onReply: () => active && onStartReply(active),
      onEdit: () => {
        setActionsOpen(false)
        setReplyingTo(null)
        setEditing(active)
        focusComposer()
      },
      onDelete: () => {
        setActionsOpen(false)
        if (!active) return
        const message = active
        confirm({
          title: "Delete message?",
          message: "It disappears for both of you. This cannot be undone.",
          actions: [
            {
              label: "Delete",
              destructive: true,
              onPress: () => remove.mutate(message.id),
            },
          ],
        })
      },
      onReport: () => {
        setActionsOpen(false)
        if (active)
          report.open({ type: "message", id: active.id, conversationId: id })
      },
    },

    menu,
    report: report.sheet,
  }
}
