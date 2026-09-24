"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { nameOf } from "@/features/users/utils/names"
import { showSuccess } from "@/lib/feedback"
import { claimReferral } from "../api"
import { referralsChanged } from "../cache"
import { isCompleteInviteCode, normalizeInviteCode } from "../utils/invite"

export function useClaimReferral() {
  return useMutation({
    mutationFn: claimReferral,
    onSuccess: (referrer) => {
      referralsChanged()
      showSuccess(`You joined with ${nameOf(referrer)}’s invite`)
    },
  })
}

export function useClaimForm(initial = "") {
  const [value, setValue] = useState(() => normalizeInviteCode(initial))
  const claim = useClaimReferral()
  const ready = isCompleteInviteCode(value) && !claim.isPending

  return {
    value,
    change: (raw: string) => setValue(normalizeInviteCode(raw)),
    ready,
    busy: claim.isPending,
    submit: () => {
      if (!ready) return
      claim.mutate(value, { onSuccess: () => setValue("") })
    },
  }
}

export type ClaimForm = ReturnType<typeof useClaimForm>
