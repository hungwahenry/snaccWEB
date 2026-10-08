import type { LucideIcon } from "lucide-react"
import type { Author } from "@/features/users/types"

export type StickerPackKind = "favourites" | "pack"

export type StickerPackStatus = "draft" | "published" | "taken_down"

export interface StickerImage {
  url: string
  preview_url: string | null
  width: number
  height: number
}

export interface Sticker extends StickerImage {
  id: string
  pack_id: string
  source: "upload" | "giphy"
  format: "static" | "animated"
  premium: boolean
  held: boolean
}

export interface StickerPack {
  id: string
  kind: StickerPackKind
  title: string
  owner: Author | null
  status: StickerPackStatus
  premium: boolean
  cover: Sticker | null
  stickers_count: number
  mine: boolean
  saved: boolean
}

export interface StickerPackDetail extends StickerPack {
  stickers: Sticker[]
}

export interface StickerTray {
  favourites: StickerPack
  packs: StickerPack[]
}

export interface StickerAttachment {
  sticker_id: string | null
  pack_id: string | null
  giphy_id: string | null
  url: string | null
  preview_url: string | null
  width: number
  height: number
  removed: boolean
}

export type StickerPick =
  | (StickerImage & { kind: "pack"; stickerId: string })
  | (StickerImage & { kind: "giphy"; giphyId: string })

export interface StickerSendFields {
  stickerId?: string
  giphyStickerId?: string
}

export type KeepStickerFrom =
  | { stickerId: string }
  | { giphyId: string }
  | { snaccId: string }
  | { messageId: string }
  | { chatMessageId: string }

export interface StickerSource {
  url: string
  width: number
  height: number
}

export type StickerTileState = "ready" | "locked" | "held"

export type StickerTileAction = "keep" | "remove"

export interface PackTile {
  sticker: Sticker
  state: StickerTileState
  action: StickerTileAction | null
}

export type TrayTab = "stickers" | "giphy" | "gifs"

export interface TrayEmpty {
  icon: LucideIcon
  title: string
  description: string
}

export interface TrayTile {
  id: string
  url: string
  preview_url: string | null
  width: number
  height: number
  title?: string | null
}

export interface TrayGridState {
  items: TrayTile[]
  itemLabel: string
  loading: boolean
  failed: boolean
  empty: TrayEmpty
  onRetry: () => void
  onPick: (id: string) => void
  onKeep?: (id: string) => void
}

export interface ShelfPack {
  id: string
  title: string
  coverUrl: string | null
  favourites: boolean
}

export interface PackShelfState {
  packs: ShelfPack[]
  selectedId: string | null
  loading: boolean
  failed: boolean
  onRetry: () => void
  onSelect: (id: string) => void
  onBrowse: () => void
}

export interface PackPanelState {
  title: string
  byline: string | null
  tiles: PackTile[]
  loading: boolean
  failed: boolean
  empty: TrayEmpty
  onRetry: () => void
  onCreate?: () => void
  onPick: (tile: PackTile) => void
  onAction: (tile: PackTile) => void
}

export interface PackMenu {
  share: boolean
  report: boolean
  rename: boolean
  remove: boolean
}
