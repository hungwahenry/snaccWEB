import { BookmarkIcon, Trash2Icon } from "lucide-react"
import type {
  StickerMenuItem,
  StickerPack,
  StickerPackDetail,
  StickerPlace,
  StickerState,
  StickerTile,
  TileActionId,
} from "../types"
import { stickerState } from "./packs"

export const FAVOURITE: StickerMenuItem<"favourite"> = {
  id: "favourite",
  label: "Add to Favourites",
  icon: BookmarkIcon,
}
const UNFAVOURITE: StickerMenuItem<TileActionId> = {
  id: "unfavourite",
  label: "Remove from Favourites",
  icon: Trash2Icon,
}
const REMOVE: StickerMenuItem<TileActionId> = {
  id: "remove",
  label: "Remove from pack",
  icon: Trash2Icon,
  destructive: true,
}

export function placeOf(
  pack: Pick<StickerPack, "kind" | "mine">
): StickerPlace {
  if (pack.kind === "favourites") return "favourites"
  return pack.mine ? "own" : "others"
}

export function tileActions(
  place: StickerPlace,
  state: StickerState
): StickerMenuItem<TileActionId>[] {
  if (place === "favourites") return [UNFAVOURITE]
  if (place === "own") return state === "held" ? [REMOVE] : [FAVOURITE, REMOVE]
  return [FAVOURITE]
}

export function packTiles(
  pack: StickerPackDetail,
  premium: boolean
): StickerTile[] {
  const place = placeOf(pack)
  return pack.stickers.map((sticker) => {
    const state = stickerState(sticker, premium)
    return { sticker, state, actions: tileActions(place, state) }
  })
}
