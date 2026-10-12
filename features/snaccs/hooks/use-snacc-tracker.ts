"use client"

import { usePromotionEvents } from "@/features/ads/hooks/use-promotion-events"
import type { AdPlacement } from "@/features/ads/types"
import { useViewTracker } from "@/features/views/hooks/use-view-tracker"
import { useLiveSnaccs } from "./use-live-snaccs"

/** Counts time on screen, and keeps the counts of what is on screen live. */
export function useSnaccTracker(placement?: AdPlacement) {
  const live = useLiveSnaccs()
  const promotions = usePromotionEvents(placement)
  const { ref } = useViewTracker({
    onVisible: live,
    onPromoted: promotions.viewed,
  })

  return { ref, openPromotionLink: promotions.openLink }
}
