"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { useMoneyConfirm } from "@/features/wallet/hooks/pin/use-money-confirm"
import { WALLET_OVERVIEW_KEY } from "@/features/wallet/utils/keys"
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

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: PREMIUM_KEY }),
        queryClient.invalidateQueries({ queryKey: WALLET_OVERVIEW_KEY }),
      ])
      toast.success("Premium is yours.")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBuying(null)
    }
  }

  return { buy, buying }
}
