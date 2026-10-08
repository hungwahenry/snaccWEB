"use client"

import type { PackTile } from "../types"
import { useKeepSticker } from "./use-keep-sticker"
import { useRemovePackSticker } from "./use-remove-sticker"

export function useTileAction(): (packId: string, tile: PackTile) => void {
  const keep = useKeepSticker()
  const remove = useRemovePackSticker()

  return (packId, tile) => {
    if (tile.action === "remove") remove(packId, tile.sticker.id)
    if (tile.action === "keep") keep?.({ stickerId: tile.sticker.id })
  }
}
