"use client"

import { useConfigValue } from "@/features/config/hooks/use-config-value"

const FALLBACK = ["❤️", "😂", "🔥", "😮", "😢", "👏"]

export function useMomentReactions(mine: string | null) {
  const configured = useConfigValue("moments.reactions")
  const quick = configured.length > 0 ? [...configured] : FALLBACK

  return {
    quick,
    overflow: mine && !quick.includes(mine) ? mine : null,
  }
}
