import { HeartIcon, StickerIcon } from "lucide-react"
import { handleOf, nameOf } from "@/features/users/utils/names"
import { countLabel } from "@/lib/format"
import type {
  PackMenu,
  PackTile,
  ShelfPack,
  Sticker,
  StickerPack,
  StickerPackDetail,
  StickerTileAction,
  StickerTileState,
  StickerTray,
  TrayEmpty,
} from "../types"

export const PACK_TITLE_MAX = 60

export function packByline(pack: StickerPack): string | null {
  if (pack.kind === "favourites") return null
  if (!pack.owner) return "by Snacc"
  return `by ${handleOf(pack.owner) ?? nameOf(pack.owner)}`
}

export function packSummary(pack: StickerPack): string {
  return [packByline(pack), countLabel(pack.stickers_count, "sticker")]
    .filter(Boolean)
    .join(" · ")
}

export function coverUrlOf(pack: StickerPack): string | null {
  return pack.cover ? (pack.cover.preview_url ?? pack.cover.url) : null
}

export function canEditPack(pack: StickerPack): boolean {
  return (
    (pack.kind === "favourites" || pack.mine) && pack.status === "published"
  )
}

export function tileState(
  sticker: Sticker,
  premium: boolean
): StickerTileState {
  if (sticker.held) return "held"
  return sticker.premium && !premium ? "locked" : "ready"
}

export function tileAction(
  pack: StickerPack,
  state: StickerTileState
): StickerTileAction | null {
  if (canEditPack(pack)) return "remove"
  return state === "ready" ? "keep" : null
}

export function packTiles(
  pack: StickerPackDetail,
  premium: boolean
): PackTile[] {
  return pack.stickers.map((sticker) => {
    const state = tileState(sticker, premium)
    return { sticker, state, action: tileAction(pack, state) }
  })
}

export function shelfPacks(tray: StickerTray): ShelfPack[] {
  return [tray.favourites, ...tray.packs].map((pack) => ({
    id: pack.id,
    title: pack.title,
    coverUrl: coverUrlOf(pack),
    favourites: pack.kind === "favourites",
  }))
}

export function trayPack(
  tray: StickerTray | undefined,
  id: string | null
): StickerPack | undefined {
  if (!tray || !id) return undefined
  return [tray.favourites, ...tray.packs].find((pack) => pack.id === id)
}

export function shownPackId(
  tray: StickerTray | undefined,
  picked: string | null
): string | null {
  if (!tray) return null
  if (picked && trayPack(tray, picked)) return picked
  if (tray.favourites.stickers_count > 0) return tray.favourites.id
  return tray.packs[0]?.id ?? tray.favourites.id
}

export function packEmpty(pack: StickerPack): TrayEmpty {
  if (pack.kind === "favourites") {
    return {
      icon: HeartIcon,
      title: "No favourites yet",
      description: "Keep stickers you like and they wait for you here.",
    }
  }
  if (canEditPack(pack)) {
    return {
      icon: StickerIcon,
      title: "This pack is empty",
      description: "Create a sticker to start it off.",
    }
  }
  return {
    icon: StickerIcon,
    title: "Nothing here yet",
    description: "This pack has no stickers right now.",
  }
}

export function packMenu(pack: StickerPack): PackMenu {
  const own = pack.mine && pack.kind === "pack"
  return {
    share: pack.kind === "pack" && pack.status === "published",
    report: !pack.mine,
    rename: own && pack.status === "published",
    remove: own,
  }
}

export function canSavePack(pack: StickerPack): boolean {
  return pack.kind === "pack" && pack.status === "published"
}

export function packTitleReady(title: string): boolean {
  const trimmed = title.trim()
  return trimmed.length > 0 && trimmed.length <= PACK_TITLE_MAX
}
