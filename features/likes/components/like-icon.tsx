"use client"

import { useState } from "react"
import type { LikeGlyphProps } from "../types"
import { LikeBurst } from "./like-burst"
import { LikeGlyph } from "./like-glyph"

export function LikeIcon({ liked, size, className }: LikeGlyphProps) {
  const [seen, setSeen] = useState(liked)
  const [burst, setBurst] = useState(0)

  if (liked !== seen) {
    setSeen(liked)
    setBurst(liked ? burst + 1 : 0)
  }

  return (
    <span
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      {burst > 0 ? (
        <LikeBurst
          key={burst}
          liked={liked}
          size={size}
          className={className}
          onDone={() => setBurst(0)}
        />
      ) : (
        <LikeGlyph liked={liked} size={size} className={className} />
      )}
    </span>
  )
}
