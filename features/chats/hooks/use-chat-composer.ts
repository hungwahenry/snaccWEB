"use client"

import { ImageIcon, StickerIcon } from "lucide-react"
import { useCallback, useMemo, useState, type RefObject } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { Gif } from "@/features/giphy/types"
import { useMessageComposer } from "@/features/messages/hooks/use-message-composer"
import type { ComposerAction } from "@/features/messages/types"
import { useStickerCreator } from "@/features/stickers/hooks/use-sticker-creator"
import type { Sticker } from "@/features/stickers/types"
import type { VoiceDraft } from "@/features/voice/types"
import { useDraftImages } from "@/hooks/use-draft-images"
import { submitChatMessage } from "../cache/pending-chat-messages"
import type { ChatDraft, ChatMessage } from "../types"
import { chatComposerContext } from "../utils/rooms"
import { useEditChatMessage } from "./use-chat-actions"

interface ChatComposerInput {
  inputRef: RefObject<HTMLTextAreaElement | null>
  onType: () => void
  onSent: () => void
}

/** Everything below a room: the field, what it answers or edits, photos, stickers, voice. */
export function useChatComposer(
  roomId: string,
  { inputRef, onType, onSent }: ChatComposerInput
) {
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [editing, setEditing] = useState<ChatMessage | null>(null)
  const [trayOpen, setTrayOpen] = useState(false)
  const images = useDraftImages()
  const edit = useEditChatMessage(roomId)
  const maxImages = useConfigValue("chat.max_images")
  const gifsEnabled = useFlag("message_gifs")
  const stickersEnabled = useFlag("message_stickers")
  const voiceEnabled = useFlag("voice_notes")

  const focus = useCallback(() => inputRef.current?.focus(), [inputRef])

  const send = useCallback(
    (draft: Omit<ChatDraft, "replyingTo">) => {
      submitChatMessage(roomId, { ...draft, replyingTo })
      setReplyingTo(null)
      onSent()
    },
    [roomId, replyingTo, onSent]
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
    send({ body: body || null, images: images.draft })
    images.reset()
  }

  const startReply = useCallback(
    (message: ChatMessage) => {
      setEditing(null)
      setReplyingTo(message)
      focus()
    },
    [focus]
  )

  const startEdit = useCallback(
    (message: ChatMessage) => {
      setReplyingTo(null)
      setEditing(message)
      focus()
    },
    [focus]
  )

  const context = useMemo(
    () => chatComposerContext({ editing, replyingTo }),
    [editing, replyingTo]
  )

  const composer = useMessageComposer({
    onSend: submit,
    sending: edit.isPending,
    context,
    onCancelContext: () => {
      setReplyingTo(null)
      setEditing(null)
    },
    editing,
    lengthKey: "chat.message_max_length",
    onType,
    images: images.draft,
    maxImages,
    canSendVoice: voiceEnabled,
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
                onPress: () => images.add(maxImages),
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
      ]

  return {
    startReply,
    startEdit,
    field: {
      ...composer.field,
      inputRef,
      actions,
      images: images.draft,
      onRemoveImage: images.remove,
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
