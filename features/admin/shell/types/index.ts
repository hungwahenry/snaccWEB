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
  url: string
  preview_url?: string | null
}

export interface MediaVoice {
  url: string
  duration_ms: number
}

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
