"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { useFlag } from "@/features/config/hooks/use-flag"
import { showSuccess } from "@/lib/feedback"
import { keepSticker } from "../api"
import { packStickersChanged } from "../cache"
import type { KeepStickerFrom } from "../types"

export function useKeepSticker():
  ((from: KeepStickerFrom) => void) | undefined {
  const enabled = useFlag("stickers")
  const keep = useMutation({
    mutationFn: keepSticker,
    onSuccess: (sticker) => {
      packStickersChanged(sticker.pack_id)
      showSuccess("Kept in your Favourites.")
    },
  })

  return enabled ? keep.mutate : undefined
}

export function useConfirmKeepSticker():
  ((from: KeepStickerFrom) => void) | undefined {
  const keep = useKeepSticker()

  return (
    keep &&
    ((from) =>
      confirm({
        title: "Keep this sticker?",
        message: "It goes in your Favourites, ready to send from the tray.",
        actions: [{ label: "Keep", onPress: () => keep(from) }],
      }))
  )
}
