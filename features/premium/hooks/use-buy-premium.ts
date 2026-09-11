"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { walletChanged } from "@/features/wallet/cache"
import { useMoneyConfirm } from "@/features/wallet/hooks/pin/use-money-confirm"
import { showError, showSuccess } from "@/lib/feedback"
import { buyPremium } from "../api"
import type { PremiumPlan, PremiumWalletPlan } from "../types"
import { PREMIUM_KEY } from "../utils/keys"

export function useBuyPremium() {
  const queryClient = useQueryClient()
  const confirm = useMoneyConfirm()
  const [buying, setBuying] = useState<PremiumPlan | null>(null)

  async function buy(plan: PremiumWalletPlan) {
    if (buying) return
    setBuying(plan.plan)
    try {
      const bought = await confirm.run(
        { amountKobo: plan.price_kobo, kind: "user" },
        (credential) => buyPremium(plan.plan, credential)
      )
      if (!bought) return

      walletChanged()
      await queryClient.invalidateQueries({ queryKey: PREMIUM_KEY })
      showSuccess("Premium is yours.")
    } catch (error) {
      showError(error)
    } finally {
      setBuying(null)
    }
  }

  return { buy, buying }
}
