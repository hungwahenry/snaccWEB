"use client"

import { useCallback, useState } from "react"
import { confirm } from "@/components/ui/confirm"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { ReportTarget } from "@/features/reports/types"
import { useKeepChatMessageSticker } from "@/features/stickers/hooks/use-keep-sticker"
import { useStickerStudio } from "@/providers/sticker-studio-provider"
import type { ChatMessage } from "../types"
import { canEditChatMessage, chatStickerSource } from "../utils/rooms"
import { useWithdrawChatMessage } from "./use-chat-actions"

interface ChatMessageSheetInput {
  onReply: (message: ChatMessage) => void
  onEdit: (message: ChatMessage) => void
  onSeeReactions: (message: ChatMessage) => void
  onReport: (target: ReportTarget) => void
}

/** The sheet of things you can do to one room message, opened by a long press or its menu button. */
export function useChatMessageSheet(
  roomId: string,
  { onReply, onEdit, onSeeReactions, onReport }: ChatMessageSheetInput
) {
  const [message, setMessage] = useState<ChatMessage | null>(null)
  const [open, setOpen] = useState(false)
  const withdraw = useWithdrawChatMessage(roomId)
  const keepSticker = useKeepChatMessageSticker()
  const stickerStudio = useStickerStudio()
  const editingEnabled = useFlag("message_editing")
  const editWindowMinutes = useConfigValue(
    "content.message.edit_window_minutes"
  )

  const openFor = useCallback((target: ChatMessage) => {
    setMessage(target)
    setOpen(true)
  }, [])

  function closeThen(act: (target: ChatMessage) => void) {
    return () => {
      setOpen(false)
      if (message) act(message)
    }
  }

  const source = message ? chatStickerSource(message) : null

  return {
    openFor,
    sheet: {
      open,
      onOpenChange: setOpen,
      message,
      canEdit:
        message !== null &&
        editingEnabled &&
        canEditChatMessage(message, editWindowMinutes),
      onReply: closeThen(onReply),
      onEdit: closeThen(onEdit),
      onSeeReactions:
        message && message.reactions.length > 0
          ? closeThen(onSeeReactions)
          : undefined,
      onWithdraw: closeThen((target) =>
        confirm({
          title: "Withdraw this message?",
          message: "It leaves a gap in the room where it was.",
          actions: [
            {
              label: "Withdraw",
              destructive: true,
              onPress: () => withdraw.mutate(target.id),
            },
          ],
        })
      ),
      onReport: closeThen((target) =>
        onReport({ type: "chat_message", id: target.id })
      ),
      onKeepSticker:
        keepSticker && message?.sticker
          ? closeThen((target) => keepSticker(target.id))
          : undefined,
      onMakeSticker:
        stickerStudio && source
          ? closeThen(() => stickerStudio(source))
          : undefined,
    },
  }
}
