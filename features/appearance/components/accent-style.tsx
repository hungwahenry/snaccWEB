"use client"

import { useEffect } from "react"
import { useAccent } from "../hooks/use-accent"
import { accentCss, ACCENT_STYLE_ID } from "../utils/accent-css"

/**
 * Keeps the accent in step after boot. It writes into the node AccentScript already put in the
 * head rather than rendering a second one, so there is only ever one answer in the document and
 * switching back to the default actually clears the old colour.
 */
export function AccentStyle() {
  const [accent] = useAccent()

  useEffect(() => {
    let node = document.getElementById(ACCENT_STYLE_ID)
    if (!node) {
      node = document.createElement("style")
      node.id = ACCENT_STYLE_ID
      document.head.appendChild(node)
    }
    node.textContent = accentCss(accent)
  }, [accent])

  return null
}
