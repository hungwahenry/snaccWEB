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
  const topUp = useCampaignTopUp(campaign.id)
  const extend = useCampaignExtend(campaign)
  const open = isOpen(campaign)

  return {
    ends: open ? extend.field : null,
    timeSheet: extend.sheet,
    topUp: open ? topUp : null,
    switcher: canPause(campaign)
      ? {
          label: "Pause promotion",
          busy: actions.switching,
          onPress: actions.onPause,
        }
      : canResume(campaign)
        ? {
            label: "Resume promotion",
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
