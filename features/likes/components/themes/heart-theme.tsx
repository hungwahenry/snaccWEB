import { HeartIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LikeGlyphProps, LikeParticleProps, LikeTheme } from "../../types"

function HeartGlyph({ liked, size, className }: LikeGlyphProps) {
  return (
    <HeartIcon
      aria-hidden
      size={size}
      fill={liked ? "currentColor" : "none"}
      className={cn("shrink-0", liked ? "text-like" : className)}
    />
  )
}

function Dot({ size, index }: LikeParticleProps) {
  return (
    <span
      className={cn(
        "block rounded-full",
        index % 2 === 0 ? "bg-like" : "bg-like/60"
      )}
      style={{ width: size, height: size }}
    />
  )
}

export const HEART_THEME: LikeTheme = { Glyph: HeartGlyph, Particle: Dot }
