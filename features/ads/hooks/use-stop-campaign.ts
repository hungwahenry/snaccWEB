"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { walletChanged } from "@/features/wallet/cache"
import { showSuccess } from "@/lib/feedback"
import { cancelCampaign } from "../api"
import { adKeys } from "../utils/keys"

export function useStopCampaign(id: string) {
  const queryClient = useQueryClient()
  const stop = useMutation({
    mutationFn: () => cancelCampaign(id),
    onSuccess: (campaign) => {
      queryClient.setQueryData(adKeys.campaign(id), campaign)
      void queryClient.invalidateQueries({ queryKey: adKeys.campaigns() })
      walletChanged()
      showSuccess("Promotion stopped.")
    },
  })

  return {
    stopping: stop.isPending,
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
