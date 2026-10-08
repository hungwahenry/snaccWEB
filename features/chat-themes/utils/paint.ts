import type { CSSProperties } from "react"
import type { ChatBackground, ChatLook, ChatPaint } from "../types"

export type ColorMode = "light" | "dark"

export function paintOf(look: ChatLook, mode: ColorMode): ChatPaint {
  return mode === "dark" ? look.dark : look.light
}

export function backgroundOf(background: ChatBackground): string {
  if (background.kind === "solid") return background.color

  const stops =
    background.colors.length > 1
      ? background.colors
      : [background.colors[0], background.colors[0]]
  return `linear-gradient(${background.angle}deg, ${stops.join(", ")})`
}

export function threadColors(paint: ChatPaint): CSSProperties {
  return {
    "--primary": paint.mine.fill,
    "--primary-foreground": paint.mine.text,
    "--muted": paint.theirs.fill,
    "--foreground": paint.theirs.text,
    "--muted-foreground": paint.meta,
  } as CSSProperties
}
