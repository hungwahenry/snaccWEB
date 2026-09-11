"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback, useState } from "react"
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
  })

  return {
    url: opened?.url ?? null,
    openingId: open.isPending ? (open.variables?.photo.id ?? null) : null,
    open: open.mutate,
    close: useCallback(() => setOpened(null), []),
  }
}
