import type { ChatLook, ChatThemeKind } from "@/features/chat-themes/types"

export interface AdminChatTheme {
  id: string
  key: string
  label: string
  kind: ChatThemeKind
  look: ChatLook
  position: number
  enabled: boolean
  premium: boolean
  updated_at: string
}

export interface UpdateChatThemeInput {
  label?: string
  position?: number
  enabled?: boolean
  premium?: boolean
}
