import { INK, type Accent } from "./accents"

/** The id of the one style node the accent lives in, written first by the boot script. */
export const ACCENT_STYLE_ID = "snacc-accent"

export function accentCss(accent: Accent): string {
  if (accent.key === INK.key) return ""

  return `:root{--primary:${accent.light.primary};--primary-foreground:${accent.light.foreground};--ring:${accent.light.primary}}.dark{--primary:${accent.dark.primary};--primary-foreground:${accent.dark.foreground};--ring:${accent.dark.primary}}`
}
