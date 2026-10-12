"use client"

import { useMemo, useRef } from "react"
import { useOpenSiteLink } from "@/features/links/hooks/use-open-site-link"
import type { Snacc } from "@/features/snaccs/types"
import type { AdPlacement } from "../types"
import { adEvent } from "../utils/queue"

export function usePromotionEvents(placement: AdPlacement | undefined) {
  const openSiteLink = useOpenSiteLink()
  const seen = useRef(new Set<string>())

  return useMemo(
    () => ({
      viewed(campaignId: string) {
        if (!placement || seen.current.has(campaignId)) return
        seen.current.add(campaignId)
        adEvent({ campaignId, kind: "view", placement })
      },
      openLink(snacc: Snacc) {
        const promotion = snacc.promoted
        if (!promotion?.button) return

        if (placement) {
          adEvent({
            campaignId: promotion.campaign_id,
            kind: "click",
            placement,
          })
        }
        openSiteLink(promotion.button.url)
      },
    }),
    [placement, openSiteLink]
  )
}
