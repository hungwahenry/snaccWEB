import type { LucideIcon } from "lucide-react"
import type { Gif } from "@/features/giphy/types"
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
  favourites: StickerPackDetail
  packs: StickerPackDetail[]
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

export type StickerState = "ready" | "locked" | "held"

export type StickerPlace = "favourites" | "own" | "others"

export interface StickerMenuItem<Id extends string = string> {
  id: Id
  label: string
  icon: LucideIcon
  destructive?: boolean
}

export type TileActionId = "favourite" | "unfavourite" | "remove"

export type PackMenuId = "share" | "copy" | "rename" | "delete" | "report"

export type MakeMenuId = "upload" | "giphy"

export interface StickerTile {
  sticker: Sticker
  state: StickerState
  actions: StickerMenuItem<TileActionId>[]
}

export type PickerTab = "stickers" | "gifs"

export type PackSave = "add" | "remove"

export type PickerRow =
  | {
      kind: "section"
      key: string
      packId: string
      title: string
      byline: string | null
      makes: boolean
      opens: boolean
    }
  | { kind: "tile"; key: string; tile: StickerTile }
  | { kind: "hint"; key: string }
  | { kind: "discover"; key: string }
  | { kind: "pack"; key: string; pack: StickerPack; details: string }
  | {
      kind: "top"
      key: string
      pack: StickerPackDetail
      details: string
      save: PackSave | null
    }
  | { kind: "giphy"; key: string; gif: Gif }

export interface PickerJump {
  key: string
  pack: StickerPackDetail | null
}

export interface HubAction {
  label: string
  outline: boolean
}

export type HubRow =
  | { kind: "section"; key: string; title: string }
  | {
      kind: "pack"
      key: string
      pack: StickerPack
      details: string
      action: HubAction | null
    }
  | { kind: "new"; key: string }
