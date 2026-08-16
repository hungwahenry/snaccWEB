export interface AnonMessage {
  id: string
  body: string | null
  mine: boolean
  created_at: string
}

export interface AnonThread {
  conversation_id: string
  recipient: { username: string | null; display_name: string | null; avatar_url: string }
  messages: AnonMessage[]
  remaining: number
}
