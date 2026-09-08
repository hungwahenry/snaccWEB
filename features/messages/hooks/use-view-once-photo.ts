"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { openPhoto } from "../api"
import { markPhotoOpened } from "../cache"
import type { MessageImage } from "../types"

interface Opened {
  messageId: string
  photo: MessageImage
  url: string
}

export function useViewOncePhoto(conversationId: string) {
  const [opened, setOpened] = useState<Opened | null>(null)

  const open = useMutation({
    mutationFn: ({
      messageId,
      photo,
    }: {
      messageId: string
      photo: MessageImage
    }) =>
      openPhoto(conversationId, messageId, photo.id).then((result) => ({
        messageId,
        photo,
        url: result.url,
      })),
    onSuccess: (result) => {
      setOpened(result)
      markPhotoOpened(conversationId, result.photo.id)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return {
    url: opened?.url ?? null,
    opening: open.isPending,
    open: open.mutate,
    close: useCallback(() => setOpened(null), []),
  }
}
