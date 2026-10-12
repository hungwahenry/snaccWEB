"use client"

import { useRouter } from "next/navigation"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { snaccPath } from "@/features/snaccs/routes"
import type { EmbeddedSnacc } from "@/features/snaccs/types"
import { toEmbedded } from "@/features/snaccs/utils/resnaccs"
import { useBack } from "@/hooks/use-back"
import { useNow } from "@/hooks/use-now"
import { isNotFound } from "@/lib/api/errors"
import { PROMOTIONS_PATH } from "../routes"
import { campaignStatus, canStop, statusNote } from "../utils/campaigns"
import { useCampaign } from "./use-campaigns"
import { useStopCampaign } from "./use-stop-campaign"

const TICK_MS = 60_000

export function usePromotionScreen(id: string) {
  const router = useRouter()
  const onBack = useBack(PROMOTIONS_PATH)
  const enabled = useFlagWhenKnown("ads_manager")
  const query = useCampaign(id, enabled === true)
  const stop = useStopCampaign(id)
  const now = useNow(TICK_MS)

  const campaign = query.data ?? null

  return {
    onBack,
    enabled,
    loading: enabled === null || query.isPending,
    gone: isNotFound(query.error),
    retry: () => void query.refetch(),
    view: campaign
      ? {
          campaign,
          status: campaignStatus(campaign, now),
          note: statusNote(campaign, now),
          preview: toEmbedded(campaign.snacc),
          stoppable: canStop(campaign),
        }
      : null,
    onOpenSnacc: (snacc: EmbeddedSnacc) => router.push(snaccPath(snacc.id)),
    ...stop,
  }
}
