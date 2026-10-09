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
  in_use: number
  image_url: string | null
  updated_at: string
}

export interface CreateChatThemeInput {
  key: string
  label: string
  kind: ChatThemeKind
  look: ChatLook
  position?: number
}

export interface UpdateChatThemeInput {
  label?: string
  look?: ChatLook
  position?: number
  enabled?: boolean
  premium?: boolean
}

export type BackgroundStyle = "solid" | "gradient"

export type LookMode = keyof ChatLook

export interface PaintDraft {
  style: BackgroundStyle
  solid: string
  stops: string[]
  angle: string
  wash: string
  mineFill: string
  mineText: string
  theirsFill: string
  theirsText: string
  meta: string
}

export interface ChatThemeDraft {
  key: string
  label: string
  kind: ChatThemeKind
  position: string
  picture: File | null
  pictureUrl: string | null
  light: PaintDraft
  dark: PaintDraft
}
