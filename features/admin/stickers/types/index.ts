import type { UserRef } from "@/lib/api/types"

export type StickerPackStatus = "draft" | "published" | "taken_down"

export type PackOwner = "snacc" | "people"

export type PackListed = "true" | "false"

export interface AdminSticker {
  id: string
  pack_id: string
  source: "upload" | "giphy"
  format: "static" | "animated"
  url: string
  preview_url: string | null
  width: number
  height: number
  premium: boolean
  held: boolean
}

export interface PackSticker extends AdminSticker {
  held_at: string | null
  removed_at: string | null
}

export interface AdminStickerPack {
  id: string
  title: string
  owner: UserRef | null
  status: StickerPackStatus
  premium: boolean
  added_by_default: boolean
  listed_at: string | null
  published_at: string | null
  saves_count: number
  open_reports: number
  created_at: string
  updated_at: string
  cover: AdminSticker | null
  stickers_count: number
}

export interface AdminStickerPackDetail extends AdminStickerPack {
  stickers: PackSticker[]
}

export interface HeldSticker extends PackSticker {
  created_at: string
  pack: {
    id: string
    title: string
    kind: "favourites" | "pack"
    status: StickerPackStatus
  }
  owner: UserRef | null
}

export type PackListQuery = {
  page: number
  perPage: number
  q?: string
  owner?: PackOwner
  status?: StickerPackStatus
  listed?: boolean
}

export interface PackFilters {
  page: number
  q: string
  owner: PackOwner | null
  status: StickerPackStatus | null
  listed: PackListed | null
}

export type HeldListQuery = {
  page: number
  perPage: number
  q?: string
}

export interface UpdatePackInput {
  title?: string
  premium?: boolean
}

export type MoveDirection = "earlier" | "later"

export interface PackAbilities {
  curate: boolean
  publish: boolean
  publishReady: boolean
  unpublish: boolean
  addToTrays: boolean
  remove: boolean
  feature: boolean
  takeDown: boolean
}

export interface PackStickerGroups {
  live: PackSticker[]
  removed: PackSticker[]
}

export interface UploadProgress {
  done: number
  total: number
}

export interface TitleDraft {
  title: string
}
