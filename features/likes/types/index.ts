import type { ComponentType } from "react"

export interface LikeGlyphProps {
  liked: boolean
  size: number
  className?: string
}

export interface LikeParticleProps {
  size: number
  index: number
}

export interface LikeTheme {
  Glyph: ComponentType<LikeGlyphProps>
  Particle: ComponentType<LikeParticleProps>
}

export interface Burst {
  id: number
  x: number
  y: number
}
