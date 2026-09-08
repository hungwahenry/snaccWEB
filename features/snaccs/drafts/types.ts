import type { Gif } from "@/features/giphy/types"
import type { DraftSticker } from "@/features/stickers/types"

export interface StoredDraftImage {
  blob: Blob
  width: number
  height: number
  mimeType: string
  fileName: string
}

export interface StoredVoice {
  blob: Blob
  mimeType: string
  durationMs: number
}

export interface StoredPollDraft {
  options: { text: string; image: StoredDraftImage | null }[]
  days: number
  hours: number
  minutes: number
}

export interface StoredDraft {
  id: string
  saved_at: string
  parentId?: string
  resnaccOfId?: string
  body: string
  spoiler: boolean
  images: StoredDraftImage[]
  voice: StoredVoice | null
  gif: Gif | null
  sticker: DraftSticker | null
  poll: StoredPollDraft | null
}

export type DraftContent = Omit<StoredDraft, "id" | "saved_at">
