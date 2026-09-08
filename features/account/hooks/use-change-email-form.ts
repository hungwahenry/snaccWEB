"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useMe } from "@/features/auth/hooks/use-me"
import { useBack } from "@/hooks/use-back"
import { getErrorMessage } from "@/lib/api/errors"
import { ME_KEY } from "@/lib/query-keys"
import { useStepUp } from "@/providers/step-up-provider"
import { changeEmail } from "../api"

export function useChangeEmailForm() {
  const me = useMe()
  const back = useBack("/settings")
  const stepUp = useStepUp()
  const queryClient = useQueryClient()
  const [newEmail, setNewEmail] = useState("")

  const change = useMutation({
    mutationFn: changeEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ME_KEY })
      toast.success("Email updated. Other devices were signed out.")
      back()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
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
