"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { showError } from "@/lib/feedback"
import { removePackSticker } from "../api"
import { dropSticker, refreshStickerPacks, restoreStickers } from "../cache"
import type { StickerTile, TileActionId } from "../types"
import { useKeepSticker } from "./use-keep-sticker"

export function useTileActions(): (
  tile: StickerTile,
  action: TileActionId
) => void {
  const keep = useKeepSticker()
  const remove = useMutation({
    mutationFn: removePackSticker,
    onMutate: ({ packId, stickerId }) => dropSticker(packId, stickerId),
    onError: (error, { packId }, snapshot) => {
      restoreStickers(packId, snapshot)
      showError(error)
    },
    onSettled: refreshStickerPacks,
  })

  return (tile, action) => {
    const target = { packId: tile.sticker.pack_id, stickerId: tile.sticker.id }

    if (action === "favourite") keep?.({ stickerId: target.stickerId })
    if (action === "unfavourite") remove.mutate(target)
    if (action === "remove") {
      confirm({
        title: "Remove it from the pack?",
        message:
          "It leaves the pack for everyone who has it. Anywhere it was sent stays.",
        actions: [
          {
            label: "Remove",
            destructive: true,
            onPress: () => remove.mutate(target),
          },
        ],
      })
    }
  }
}
