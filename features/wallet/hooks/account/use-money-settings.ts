"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import type { MoneyRequestPrivacy } from "@/features/users/types"
import { useMutes } from "../requests/use-mutes"
import { useWalletSettings } from "./use-wallet-settings"

export function useMoneySettings() {
  const me = useMe()
  const settings = useWalletSettings()
  const mutes = useMutes()
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const privacy = me.data?.profile?.money_requests_from ?? "everyone"

  return {
    privacy,
    privacyOpen,
    setPrivacyOpen,
    mutedCount: mutes.data?.length ?? 0,
    selectPrivacy: (value: MoneyRequestPrivacy) => {
      setPrivacyOpen(false)
      if (value !== privacy) settings.mutate({ moneyRequestsFrom: value })
    },
  }
}
