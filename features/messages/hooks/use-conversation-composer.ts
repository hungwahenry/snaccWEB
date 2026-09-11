"use client"

import { ImageIcon, StickerIcon } from "lucide-react"
import { useCallback, useMemo, useState, type RefObject } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { Gif } from "@/features/giphy/types"
import { useStickerCreator } from "@/features/stickers/hooks/use-sticker-creator"
import type { Sticker } from "@/features/stickers/types"
import type { VoiceDraft } from "@/features/voice/types"
import { submitMessage } from "../cache/pending-messages"
import type {
  ComposerAction,
  Conversation,
  Message,
  MessageDraft,
} from "../types"
import { composerContext } from "../utils/composer"
import { useEditMessage } from "./use-message-actions"
import { useMessageAttachments } from "./use-message-attachments"
import { useMessageComposer } from "./use-message-composer"

interface ConversationComposerInput {
  conversation: Conversation | null
  inputRef: RefObject<HTMLTextAreaElement | null>
  /** Money and other screen-level extras for the plus menu, shown while not editing. */
  extraActions: ComposerAction[]
  onType: () => void
  onSent: () => void
}

/** Everything below a DM thread: the field, what it answers or edits, photos, stickers, voice. */
export function useConversationComposer(
  conversationId: string,
  {
    conversation,
    inputRef,
    extraActions,
    onType,
    onSent,
  }: ConversationComposerInput
) {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editing, setEditing] = useState<Message | null>(null)
  const [trayOpen, setTrayOpen] = useState(false)
  const attachments = useMessageAttachments()
  const edit = useEditMessage(conversationId)
  const gifsEnabled = useFlag("message_gifs")
  const stickersEnabled = useFlag("message_stickers")
  const voiceEnabled = useFlag("voice_notes")

  const focus = useCallback(() => inputRef.current?.focus(), [inputRef])

  const send = useCallback(
    (draft: Omit<MessageDraft, "replyingTo">) => {
      submitMessage(conversationId, { ...draft, replyingTo })
      setReplyingTo(null)
      onSent()
    },
    [conversationId, replyingTo, onSent]
  )

  const sendSticker = (sticker: Sticker) =>
    send({ body: null, images: [], sticker })
  const sendGif = (gif: Gif) => send({ body: null, images: [], gif })
  const sendVoice = (voice: VoiceDraft) =>
    send({ body: null, images: [], voice })
  const stickerCreator = useStickerCreator(sendSticker)

  function submit(body: string) {
    if (editing) {
      edit.mutate({ messageId: editing.id, body })
      setEditing(null)
      return
    }
    send({
      body: body || null,
      images: attachments.draft,
      viewOnce: attachments.viewOnce,
    })
    attachments.reset()
  }

  const startReply = useCallback(
    (message: Message) => {
      setEditing(null)
      setReplyingTo(message)
      focus()
    },
    [focus]
  )

  const startEdit = useCallback(
    (message: Message) => {
      setReplyingTo(null)
      setEditing(message)
      focus()
    },
    [focus]
  )

  const context = useMemo(
    () => composerContext({ editing, replyingTo }),
    [editing, replyingTo]
  )
  const canSendVoice =
    voiceEnabled &&
    conversation !== null &&
    (!conversation.you_are_ghost || conversation.revealed)

  const composer = useMessageComposer({
    onSend: submit,
    sending: edit.isPending,
    context,
    onCancelContext: () => {
      setReplyingTo(null)
      setEditing(null)
    },
    editing,
    onType,
    images: attachments.draft,
    maxImages: attachments.maxImages,
    canSendVoice,
    onSendVoice: sendVoice,
  })

  const trayOffered = stickersEnabled || gifsEnabled
  const actions: ComposerAction[] = editing
    ? []
    : [
        ...(composer.canAttach
          ? [
              {
                key: "photo",
                icon: ImageIcon,
                label: "Photo",
                hint: "From your device",
                onPress: attachments.onAddImages,
              },
            ]
          : []),
        ...(trayOffered
          ? [
              {
                key: "stickers",
                icon: StickerIcon,
                label: stickersEnabled ? "Sticker or GIF" : "GIF",
                hint: "From the tray",
                onPress: () => setTrayOpen(true),
              },
            ]
          : []),
        ...extraActions,
      ]

  return {
    startReply,
    startEdit,
    field: {
      ...composer.field,
      inputRef,
      actions,
      imageUpgrade: attachments.imageUpgrade,
      images: attachments.draft,
      onRemoveImage: attachments.onRemoveImage,
      viewOnce: attachments.viewOnce,
      onToggleViewOnce: attachments.viewOnceEnabled
        ? attachments.onToggleViewOnce
        : undefined,
    },
    stickerTray: trayOffered
      ? {
          open: trayOpen,
          onOpenChange: setTrayOpen,
          onPickSticker: stickersEnabled ? sendSticker : undefined,
          onPickGif: gifsEnabled ? sendGif : undefined,
          onCreateSticker: stickersEnabled
            ? () => {
                setTrayOpen(false)
                stickerCreator.begin()
              }
            : undefined,
        }
      : null,
    stickerCreator,
  }
}
