"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { walletChanged } from "@/features/wallet/cache"
import { showSuccess } from "@/lib/feedback"
import { cancelCampaign, pauseCampaign, resumeCampaign } from "../api"
import type { CampaignDetail } from "../types"
import { adKeys } from "../utils/keys"

export function useCampaignActions(id: string) {
  const queryClient = useQueryClient()

  function settle(campaign: CampaignDetail, message: string) {
    queryClient.setQueryData(adKeys.campaign(id), campaign)
    void queryClient.invalidateQueries({ queryKey: adKeys.campaigns() })
    showSuccess(message)
  }

  const stop = useMutation({
    mutationFn: () => cancelCampaign(id),
    onSuccess: (campaign) => {
      walletChanged()
      settle(campaign, "Promotion stopped.")
    },
  })
  const pause = useMutation({
    mutationFn: () => pauseCampaign(id),
    onSuccess: (campaign) => settle(campaign, "Promotion paused."),
  })
  const resume = useMutation({
    mutationFn: () => resumeCampaign(id),
    onSuccess: (campaign) => settle(campaign, "Promotion running again."),
  })

  return {
    stopping: stop.isPending,
    switching: pause.isPending || resume.isPending,
    onPause: () => pause.mutate(),
    onResume: () => resume.mutate(),
    onStop: () =>
      confirm({
        title: "Stop this promotion?",
        message:
          "It stops showing straight away. Whatever is left of the budget goes back to your wallet.",
        actions: [
          {
            label: "Stop promotion",
            destructive: true,
            onPress: () => stop.mutate(),
          },
        ],
      }),
  }
}
