"use client"

import { useEffect } from "react"
import { useLiveSnaccs } from "@/features/snaccs/hooks/use-live-snaccs"
import type { HangoutCard } from "../../types"

export function useLiveHangouts(cards: HangoutCard[]) {
  const live = useLiveSnaccs()
  const ids = cards.map((card) => card.snacc.id).join()

  useEffect(() => {
    live(ids ? ids.split(",") : [])
  }, [live, ids])
}
