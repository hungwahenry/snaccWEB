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
