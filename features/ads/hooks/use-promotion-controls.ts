"use client"

import { newPromotionPath } from "../routes"
import type { Campaign } from "../types"
import {
  canPause,
  canPromoteAgain,
  canResume,
  isOpen,
} from "../utils/campaigns"
import { useCampaignActions } from "./use-campaign-actions"
import { useCampaignExtend } from "./use-campaign-extend"
import { useCampaignTopUp } from "./use-campaign-top-up"

export function usePromotionControls(campaign: Campaign) {
  const actions = useCampaignActions(campaign.id)
  const topUp = useCampaignTopUp(campaign)
  const extend = useCampaignExtend(campaign)
  const open = isOpen(campaign)

  return {
    budget: open ? topUp.row : null,
    ends: open ? extend.field : null,
    topUpSheet: topUp.sheet,
    timeSheet: extend.sheet,
    switcher: canPause(campaign)
      ? {
          label: "Pause",
          busy: actions.switching,
          onPress: actions.onPause,
        }
      : canResume(campaign)
        ? {
            label: "Resume",
            busy: actions.switching,
            onPress: actions.onResume,
          }
        : null,
    stop: open ? { busy: actions.stopping, onPress: actions.onStop } : null,
    againHref: canPromoteAgain(campaign)
      ? newPromotionPath(campaign.snacc.id, campaign.id)
      : null,
  }
}

export type PromotionControls = ReturnType<typeof usePromotionControls>
