"use client"

import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { useBack } from "@/hooks/use-back"
import { useNow } from "@/hooks/use-now"
import { campaignStatus } from "../utils/campaigns"
import { useCampaigns } from "./use-campaigns"

const TICK_MS = 60_000

export function usePromotionsScreen() {
  const onBack = useBack()
  const enabled = useFlagWhenKnown("ads_manager")
  const list = useCampaigns(enabled === true)
  const now = useNow(TICK_MS)

  return {
    onBack,
    enabled,
    loading: enabled === null || list.loading,
    failed: list.failed && list.items.length === 0,
    retry: list.retry,
    rows: list.items.map((campaign) => ({
      campaign,
      status: campaignStatus(campaign, now),
    })),
    loadingMore: list.loadingMore,
    loadMore: list.loadMore,
  }
}
