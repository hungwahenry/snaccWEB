import type { SnaccClip } from "@/features/snaccs/types"

export interface MediaImage {
  id?: string
  url: string
  width?: number
  height?: number
}

export interface MediaGif {
  url: string
}

export interface MediaSticker {
  url: string | null
  preview_url?: string | null
  removed: boolean
}

export interface MediaVoice {
  url: string
  duration_ms: number
}

export type MediaClip = SnaccClip

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

/** How a status reads on screen: the words, and the badge that carries them. */
export interface StatusMeta {
  label: string
  variant: BadgeVariant
}

export interface Option<V extends string = string> {
  value: V
  label: string
}
