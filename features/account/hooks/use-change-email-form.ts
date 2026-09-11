"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useBack } from "@/hooks/use-back"
import { authKeys } from "@/features/auth/utils/keys"
import { useStepUp } from "@/providers/step-up-provider"
import { changeEmail } from "../api"
import { showSuccess } from "@/lib/feedback"

export function useChangeEmailForm() {
  const me = useMe()
  const back = useBack("/settings")
  const stepUp = useStepUp()
  const queryClient = useQueryClient()
  const [newEmail, setNewEmail] = useState("")

  const change = useMutation({
    mutationFn: changeEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.me() })
      showSuccess("Email updated. Other devices were signed out.")
      back()
    },
  })

  const valid = /^\S+@\S+\.\S+$/.test(newEmail.trim())

  async function onSubmit() {
    if (!valid || change.isPending) return
    try {
      const challengeId = await stepUp("email_change", {
        newEmail: newEmail.trim(),
      })
      change.mutate(challengeId)
    } catch {}
  }

  return {
    currentEmail: me.data?.email ?? null,
    newEmail,
    setNewEmail,
    valid,
    submitting: change.isPending,
    onSubmit: () => void onSubmit(),
  }
}
