"use client"

import { useLikeTheme } from "../hooks/use-like-theme"
import type { LikeGlyphProps } from "../types"

export function LikeGlyph(props: LikeGlyphProps) {
  const { Glyph } = useLikeTheme()

  return <Glyph {...props} />
}
