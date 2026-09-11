"use client"

import { useMutation } from "@tanstack/react-query"
import { saveGiphySticker } from "../api"
import { refreshStickerLibrary } from "../cache"
import type { Sticker } from "../types"

/**
 * A Giphy sticker is saved to the library first and the saved copy is what gets sent. The send
 * lives in the mutation's own onSuccess, which outlives the tray closing; a per-call callback
 * would be dropped with it.
 */
export function useSendGiphySticker(
  onSend: ((sticker: Sticker) => void) | undefined
): (giphyId: string) => void {
  const save = useMutation({
    mutationFn: saveGiphySticker,
    onSuccess: (sticker) => {
      refreshStickerLibrary()
      onSend?.(sticker)
    },
  })

  return save.mutate
}
