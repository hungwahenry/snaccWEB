"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { useDateTimePicker } from "@/hooks/use-date-time-picker"
import { useNow } from "@/hooks/use-now"
import { showSuccess } from "@/lib/feedback"
import { dateAtTime } from "@/lib/format"
import { extendCampaign } from "../api"
import type { Campaign } from "../types"
import { extendBounds, SLOT_MINUTES } from "../utils/campaigns"
import { adKeys } from "../utils/keys"

const TICK_MS = 30_000

export function useCampaignExtend(
  campaign: Pick<Campaign, "id" | "starts_at" | "ends_at">
) {
  const queryClient = useQueryClient()
  const maxDays = useConfigValue("ads.max_days")
  const now = useNow(TICK_MS)
  const [open, setOpen] = useState(false)
  const bounds = extendBounds(campaign, now, maxDays)
  const picker = useDateTimePicker({
    initial: () => new Date(campaign.ends_at),
    min: bounds.min,
    max: bounds.max,
    minuteStep: SLOT_MINUTES,
  })
  const picked = picker.value.toISOString()

  const extend = useMutation({
    mutationFn: (endsAt: string) => extendCampaign(campaign.id, endsAt),
    onSuccess: (detail) => {
      queryClient.setQueryData(adKeys.campaign(campaign.id), detail)
      void queryClient.invalidateQueries({ queryKey: adKeys.campaigns() })
      setOpen(false)
      showSuccess("End date moved.")
    },
  })

  return {
    field: {
      label: "Ends",
      value: dateAtTime(campaign.ends_at),
      onEdit: () => {
        picker.reset(bounds.min)
        setOpen(true)
      },
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      title: "Ends",
      picker: {
        ...picker.props,
        summary: dateAtTime(picked),
        problem: picker.tooSoon ? "Pick a time after the current end." : null,
        confirmLabel: "Save",
        confirming: extend.isPending,
        onConfirm: () => extend.mutate(picked),
      },
    },
  }
}
