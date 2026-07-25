export interface MessageAuthor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string
  university: { id: string; name: string; acronym: string } | null
}

export interface AdminConversationRow {
  id: string
  pseudonym: string
  revealed: boolean
  ghost: MessageAuthor
  target: MessageAuthor
  message_count: number
  last_message_preview: string | null
  last_message_at: string
  created_at: string
}

export interface AdminThreadMessage {
  id: string
  body: string
  deleted_at: string | null
  created_at: string
  sender: MessageAuthor
  reply_to: { id: string; body: string; removed: boolean } | null
}

export interface AdminConversationDetail {
  id: string
  pseudonym: string
  revealed: boolean
  revealed_at: string | null
  ghost: MessageAuthor
  target: MessageAuthor
  created_at: string
  messages: AdminThreadMessage[]
}

export interface ListConversationsParams {
  page?: number
  perPage?: number
  participantId?: string
}
