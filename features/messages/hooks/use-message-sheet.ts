"use client"

import { useCallback, useState } from "react"
import { confirm } from "@/components/ui/confirm"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { ReportTarget } from "@/features/reports/types"
import { useKeepMessageSticker } from "@/features/stickers/hooks/use-keep-sticker"
import { useStickerStudio } from "@/providers/sticker-studio-provider"
import type { Message } from "../types"
import { canDeleteMessage, canEditMessage } from "../utils/editing"
import { stickerSourceOf } from "../utils/images"
import { useDeleteMessage } from "./use-message-actions"

interface MessageSheetInput {
  onReply: (message: Message) => void
  onEdit: (message: Message) => void
  onReport: (target: ReportTarget) => void
}

/** The sheet of things you can do to one message, opened by a long press or its menu button. */
export function useMessageSheet(
  conversationId: string,
  { onReply, onEdit, onReport }: MessageSheetInput
) {
  const [message, setMessage] = useState<Message | null>(null)
  const [open, setOpen] = useState(false)
  const remove = useDeleteMessage(conversationId)
  const keepSticker = useKeepMessageSticker()
  const stickerStudio = useStickerStudio()
  const editingEnabled = useFlag("message_editing")
  const editWindowMinutes = useConfigValue(
    "content.message.edit_window_minutes"
  )

  const openFor = useCallback((target: Message) => {
    setMessage(target)
    setOpen(true)
  }, [])

  function closeThen(act: (target: Message) => void) {
    return () => {
      setOpen(false)
      if (message) act(message)
    }
  }

  const source = message ? stickerSourceOf(message) : null

  return {
    openFor,
    sheet: {
      open,
      onOpenChange: setOpen,
      message,
      canEdit:
        message !== null &&
        editingEnabled &&
        canEditMessage(message, editWindowMinutes),
      canDelete: message !== null && canDeleteMessage(message),
      onReply: closeThen(onReply),
      onEdit: closeThen(onEdit),
      onDelete: closeThen((target) =>
        confirm({
          title: "Delete message?",
          message: "It disappears for both of you. This cannot be undone.",
          actions: [
            {
              label: "Delete",
              destructive: true,
              onPress: () => remove.mutate(target.id),
            },
          ],
        })
      ),
      onReport: closeThen((target) =>
        onReport({ type: "message", id: target.id, conversationId })
      ),
      onKeepSticker:
        keepSticker && message?.sticker && !message.removed
          ? closeThen((target) => keepSticker(target.id))
          : undefined,
      onMakeSticker:
        stickerStudio && source
          ? closeThen(() => stickerStudio(source))
          : undefined,
    },
  }
}
