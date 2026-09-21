"use client"

import { useState } from "react"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import type { HangoutTag } from "../../types"

export function useHangoutTag(hangoutId: string | undefined, allowed: boolean) {
  const [dropped, setDropped] = useState(false)
  const taggedId = hangoutId && allowed && !dropped ? hangoutId : undefined
  const hangout = useSnacc(taggedId ?? "").data?.hangout ?? null

  const tag: HangoutTag | undefined =
    taggedId && hangout
      ? { snacc_id: taggedId, title: hangout.title, emoji: hangout.emoji }
      : undefined

  return {
    hangoutId: taggedId,
    tag,
    remove: () => setDropped(true),
  }
}
