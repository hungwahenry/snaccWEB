export interface ChatRoomCampus {
  id: string
  name: string
  acronym: string
  slug: string
}

export interface ChatRoom {
  id: string
  name: string
  /// Null marks the room everyone is in.
  campus: ChatRoomCampus | null
  locked: boolean
  muted: boolean
  unread: number
  last_message_at: string | null
}

export interface ChatSender {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  official: boolean
}

export interface ChatImage {
  id: string
  url: string
  thumb_url: string
  width: number
  height: number
  position: number
}

export interface ChatMessage {
  id: string
  room_id: string
  body: string | null
  created_at: string
  mine: boolean
  deleted: boolean
  deleted_by_sender: boolean
  held: boolean
  sender: ChatSender
  images: ChatImage[]
  reply_to: {
    id: string
    body: string | null
    sender_username: string | null
    deleted: boolean
  } | null
}
