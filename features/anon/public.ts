import { serverGet } from "@/lib/api/server"

export interface AnonRecipient {
  username: string | null
  display_name: string | null
  avatar_url: string
  accepting: boolean
}

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

/** The recipient card behind a `/u/<username>` link (server-side, for SSR + metadata). */
export function getAnonRecipient(username: string) {
  return serverGet<AnonRecipient>(`/public/anon/${encodeURIComponent(username)}`)
}
