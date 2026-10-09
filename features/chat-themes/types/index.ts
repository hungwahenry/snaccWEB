export interface BubblePaint {
  fill: string
  text: string
}

export interface SolidBackground {
  kind: "solid"
  color: string
}

export interface GradientBackground {
  kind: "gradient"
  colors: string[]
  angle: number
}

export type ChatBackground = SolidBackground | GradientBackground

export interface ChatPaint {
  background: ChatBackground | null
  wash: string | null
  mine: BubblePaint
  theirs: BubblePaint
  meta: string
}

export interface ChatLook {
  light: ChatPaint
  dark: ChatPaint
}

export type ChatThemeKind = "preset" | "photo" | "image"

export interface ChatTheme {
  id: string
  key: string
  label: string
  kind: ChatThemeKind
  premium: boolean
  look: ChatLook
  image_url: string | null
}

export interface WornTheme extends ChatTheme {
  photo_url: string | null
}
