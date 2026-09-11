import type { LucideIcon } from "lucide-react"

export interface Sticker {
  id: string
  kind: "custom" | "giphy"
  url: string
  preview_url: string | null
  width: number
  height: number
}

export type DraftSticker = Omit<Sticker, "kind">

export interface StickerAttachment {
  sticker_id: string | null
  url: string
  preview_url: string | null
  width: number
  height: number
}

/** A picture a sticker can be cut from. */
export interface StickerSource {
  url: string
  width: number
  height: number
}

export type TrayTab = "stickers" | "gifs" | "mine"

export interface TrayTile {
  id: string
  url: string
  preview_url: string | null
  width: number
  height: number
  title?: string | null
}

export interface TrayEmpty {
  icon: LucideIcon
  title: string
  description: string
}

export interface TrayGridState {
  items: TrayTile[]
  itemLabel: string
  loading: boolean
  loadingMore: boolean
  failed: boolean
  empty: TrayEmpty
  onRetry: () => void
  onPick: (id: string) => void
  onHold?: (id: string) => void
  onEndReached?: () => void
}
