"use client"

import { useMutation } from "@tanstack/react-query"
import { refreshMe } from "@/features/auth/cache"
import { useMe } from "@/features/auth/hooks/use-me"
import type { MoneyRequestPrivacy } from "@/features/users/types"
import { updateWalletSettings } from "../../api"

export function useRequestPrivacy() {
  const me = useMe()
  const saved: MoneyRequestPrivacy =
    me.data?.profile?.money_requests_from ?? "everyone"

  const change = useMutation({
    mutationFn: (from: MoneyRequestPrivacy) =>
      updateWalletSettings({ moneyRequestsFrom: from }),
    // Returning the refetch keeps the save pending, so the new choice shows until the profile has it.
    onSuccess: () => refreshMe(),
  })

  const privacy = change.isPending ? (change.variables ?? saved) : saved

  return {
    privacy,
    setPrivacy: (next: MoneyRequestPrivacy) => {
      if (next !== privacy) change.mutate(next)
    },
  }
}
