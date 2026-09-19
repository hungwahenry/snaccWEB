"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { clipAutoplay } from "../../autoplay"
import { allowsAutoplay } from "../../utils/autoplay"

type Connected = Navigator & { connection?: { saveData?: boolean } }

function savesData(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (navigator as Connected).connection?.saveData === true
  )
}

export function useClipPreview(enabled: boolean) {
  const flag = useFlag("clip_autoplay")
  const reducedMotion = useReducedMotion()
  const [card, setCard] = useState<HTMLElement | null>(null)
  const allowed =
    enabled && allowsAutoplay({ flag, reducedMotion, savesData: savesData() })

  useEffect(() => {
    if (!card || !allowed) return
    return clipAutoplay.watch(card)
  }, [card, allowed])

  const playing = useSyncExternalStore(
    clipAutoplay.subscribe,
    () => allowed && card !== null && clipAutoplay.target() === card,
    () => false
  )

  return { watch: setCard, playing }
}
