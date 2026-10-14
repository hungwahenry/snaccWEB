import type { UserRefWithCampus } from "@/lib/api/types"
import type {
  MediaGif,
  MediaImage,
  MediaSticker,
  MediaVoice,
} from "@/features/admin/shell/types"

export type RoomKind = "country" | "campus" | "hangout"

export interface RoomCampus {
  id: string
  name: string
  acronym: string | null
}

export interface AdminRoom {
  id: string
  kind: RoomKind
  name: string
  country_code: string | null
  campus: RoomCampus | null
  locked_at: string | null
  last_message_at: string | null
  message_count: number
  created_at: string
}

export interface AdminRoomMessage {
  id: string
  body: string | null
  held_at: string | null
  deleted_at: string | null
  deleted_by: "sender" | "moderator" | null
  edited_at: string | null
  created_at: string
  images: MediaImage[]
  voice: MediaVoice | null
  sticker: MediaSticker | null
  gif: MediaGif | null
  sender: UserRefWithCampus
  reply_to: { id: string; body: string | null; removed: boolean } | null
}

export type RoomListQuery = {
  page: number
  perPage: number
  q?: string
  kind?: RoomKind
  locked?: boolean
}

export type RoomMessageQuery = {
  page: number
  perPage: number
  q?: string
  held?: boolean
}
