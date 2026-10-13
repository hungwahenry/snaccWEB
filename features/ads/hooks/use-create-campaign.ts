"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { walletChanged } from "@/features/wallet/cache"
import { useMoneyConfirm } from "@/features/wallet/hooks/pin/use-money-confirm"
import { showError, showSuccess } from "@/lib/feedback"
import { createCampaign } from "../api"
import { promotionPath } from "../routes"
import type { CampaignDraft, DraftField } from "../types"
import { campaignInput, submitProblem } from "../utils/draft"
import { adKeys } from "../utils/keys"

interface Refusal {
  draft: CampaignDraft
  field: DraftField
  message: string
}

export function useCreateCampaign(
  snaccId: string,
  onRefused: (field: DraftField) => void
) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const confirm = useMoneyConfirm()
  const [paying, setPaying] = useState(false)
  const [refusal, setRefusal] = useState<Refusal | null>(null)

  async function pay(draft: CampaignDraft, currency: string) {
    if (paying) return
    const input = campaignInput(snaccId, draft, currency, Date.now())
    setPaying(true)
    setRefusal(null)
    try {
      const campaign = await confirm.run(
        { amount: input.budget, kind: "user" },
        (credential) => createCampaign(input, credential)
      )
      if (!campaign) return

      walletChanged()
      void queryClient.invalidateQueries({ queryKey: adKeys.campaigns() })
      showSuccess("Sent for review.")
      router.replace(promotionPath(campaign.id))
    } catch (error) {
      const problem = submitProblem(error)
      if (problem) {
        setRefusal({ draft, ...problem })
        onRefused(problem.field)
      } else showError(error)
    } finally {
      setPaying(false)
    }
  }

  return { pay, paying, refusal }
}
