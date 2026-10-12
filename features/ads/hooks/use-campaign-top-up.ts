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
import { topUpProblem, wholeNaira } from "../utils/draft"
import { adKeys } from "../utils/keys"

export function useCampaignTopUp(id: string) {
  const queryClient = useQueryClient()
  const confirm = useMoneyConfirm()
  const wallet = useWalletOverview()
  const minBudgetKobo = useConfigValue("ads.min_budget_kobo")
  const [amount, setAmount] = useState("")
  const [adding, setAdding] = useState(false)

  const amountKobo = nairaToKobo(amount)
  const problem = topUpProblem(amount, {
    minBudgetKobo,
    balanceKobo: wallet.data?.balance ?? null,
  })

  async function add() {
    if (adding || amountKobo <= 0 || problem) return
    setAdding(true)
    try {
      const campaign = await confirm.run(
        { amountKobo, kind: "user" },
        (credential) => addCampaignBudget(id, amountKobo, credential)
      )
      if (!campaign) return

      queryClient.setQueryData(adKeys.campaign(id), campaign)
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
    value: amount,
    onChange: (value: string) => setAmount(wholeNaira(value)),
    hint: `At least ${formatNaira(minBudgetKobo)}. It leaves your wallet now.`,
    problem,
    label: amountKobo > 0 ? `Add ${formatNaira(amountKobo)}` : "Add",
    ready: amountKobo > 0 && problem === null,
    adding,
    onAdd: () => void add(),
  }
}
