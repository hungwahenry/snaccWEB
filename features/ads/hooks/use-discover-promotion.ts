"use client"

import { useFlag } from "@/features/config/hooks/use-flag"
import { useSnaccTracker } from "@/features/snaccs/hooks/use-snacc-tracker"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { getDiscoverPromotion } from "../api"
import { slotPage } from "../utils/discover"

export function useDiscoverPromotion() {
  const enabled = useFlag("ads")
  const tracker = useSnaccTracker("discover")
  const slot = useInfiniteList(
    snaccKeys.discoverPromotion(),
    async () => slotPage(await getDiscoverPromotion()),
    { enabled }
  )

  const snacc = enabled ? slot.items[0] : undefined
  const promoted = snacc?.promoted
  if (!snacc || !promoted) return null

  return {
    snacc,
    itemRef: tracker.ref(snacc.id, promoted.campaign_id),
    onOpenPromotionLink: tracker.openPromotionLink,
  }
}
