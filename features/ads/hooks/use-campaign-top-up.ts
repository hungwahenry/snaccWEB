"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useConfigValue } from "@/features/config/hooks/use-config-value"
import { walletChanged } from "@/features/wallet/cache"
import { useWalletOverview } from "@/features/wallet/hooks/account/use-wallet-overview"
import { useMoneyConfirm } from "@/features/wallet/hooks/pin/use-money-confirm"
import { showError, showSuccess } from "@/lib/feedback"
import { formatNaira, nairaToKobo } from "@/lib/format"
import { addCampaignBudget } from "../api"
import type { Campaign } from "../types"
import { budgetLeftLine } from "../utils/campaigns"
import { topUpProblem, wholeNaira } from "../utils/draft"
import { budgetPresets } from "../utils/estimate"
import { adKeys } from "../utils/keys"

export function useCampaignTopUp(
  campaign: Pick<Campaign, "id" | "budget_kobo" | "spent_kobo">
) {
  const queryClient = useQueryClient()
  const confirm = useMoneyConfirm()
  const wallet = useWalletOverview()
  const minBudgetKobo = useConfigValue("ads.min_budget_kobo")
  const presetsKobo = useConfigValue("ads.budget_presets_kobo")
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [adding, setAdding] = useState(false)

  const amountKobo = nairaToKobo(amount)
  const problem = topUpProblem(amount, {
    minBudgetKobo,
    balanceKobo: wallet.data?.balance ?? null,
  })
  const ready = amountKobo > 0 && problem === null

  async function add() {
    if (adding || !ready) return
    setOpen(false)
    setAdding(true)
    try {
      const updated = await confirm.run(
        { amountKobo, kind: "user" },
        (credential) => addCampaignBudget(campaign.id, amountKobo, credential)
      )
      if (!updated) return

      queryClient.setQueryData(adKeys.campaign(campaign.id), updated)
      void queryClient.invalidateQueries({ queryKey: adKeys.campaigns() })
      walletChanged()
      setAmount("")
      showSuccess("Budget added.")
    } catch (error) {
      showError(error)
    } finally {
      setAdding(false)
    }
  }

  return {
    row: {
      label: "Budget",
      value: budgetLeftLine(campaign),
      onEdit: () => {
        if (!adding) setOpen(true)
      },
    },
    sheet: {
      open,
      onOpenChange: setOpen,
      presets: {
        presets: budgetPresets(presetsKobo, null),
        selectedKobo: amountKobo,
        onPick: (kobo: number) => setAmount(String(kobo / 100)),
      },
      field: {
        value: amount,
        onChange: (value: string) => setAmount(wholeNaira(value)),
        hint: `At least ${formatNaira(minBudgetKobo)}. It leaves your wallet now.`,
      },
      problem,
      label: amountKobo > 0 ? `Add ${formatNaira(amountKobo)}` : "Add",
      ready,
      onAdd: () => void add(),
    },
  }
}
