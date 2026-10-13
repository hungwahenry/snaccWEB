"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { walletChanged } from "@/features/wallet/cache"
import { useWalletOverview } from "@/features/wallet/hooks/account/use-wallet-overview"
import { useMoneyConfirm } from "@/features/wallet/hooks/pin/use-money-confirm"
import { showError, showSuccess } from "@/lib/feedback"
import {
  currencySymbol,
  formatMoney,
  inputToMoney,
  money,
  type Money,
} from "@/lib/money"
import { addCampaignBudget } from "../api"
import type { Campaign } from "../types"
import { budgetLeftLine } from "../utils/campaigns"
import { topUpProblem, wholeUnits, wholeUnitsOf } from "../utils/draft"
import { budgetPresets } from "../utils/estimate"
import { adKeys } from "../utils/keys"
import { useAdBudget } from "./use-campaigns"

export function useCampaignTopUp(
  campaign: Pick<Campaign, "id" | "budget" | "spent">
) {
  const queryClient = useQueryClient()
  const confirm = useMoneyConfirm()
  const wallet = useWalletOverview()
  const adBudget = useAdBudget()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [adding, setAdding] = useState(false)

  const { currency } = campaign.budget
  const value = inputToMoney(amount, currency)
  const minimum = adBudget.data?.minimum ?? money(0, currency)
  const problem = topUpProblem(amount, {
    minBudget: minimum,
    balance: wallet.data?.balance ?? null,
  })
  const ready =
    value.amount > 0 && problem === null && adBudget.data !== undefined

  async function add() {
    if (adding || !ready) return
    setOpen(false)
    setAdding(true)
    try {
      const updated = await confirm.run(
        { amount: value, kind: "user" },
        (credential) => addCampaignBudget(campaign.id, value, credential)
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
        presets: budgetPresets(adBudget.data?.presets ?? [], null),
        selected: value,
        onPick: (picked: Money) => setAmount(wholeUnitsOf(picked)),
      },
      field: {
        symbol: currencySymbol(currency),
        value: amount,
        onChange: (value: string) => setAmount(wholeUnits(value)),
        hint: adBudget.data
          ? `At least ${formatMoney(minimum)}. It leaves your wallet now.`
          : "It leaves your wallet now.",
      },
      problem,
      label: value.amount > 0 ? `Add ${formatMoney(value)}` : "Add",
      ready,
      onAdd: () => void add(),
    },
  }
}
