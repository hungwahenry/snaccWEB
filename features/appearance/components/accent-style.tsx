"use client"

import { useAccent } from "../hooks/use-accent"
import { INK } from "../utils/accents"

export function AccentStyle() {
  const [accent] = useAccent()
  if (accent.key === INK.key) return null

  const css = `:root{--primary:${accent.light.primary};--primary-foreground:${accent.light.foreground};--ring:${accent.light.primary}}
.dark{--primary:${accent.dark.primary};--primary-foreground:${accent.dark.foreground};--ring:${accent.dark.primary}}`

  return <style>{css}</style>
}
