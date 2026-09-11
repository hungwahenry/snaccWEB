"use client"

import { useMutation } from "@tanstack/react-query"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useStepUp } from "@/providers/step-up-provider"
import { deleteAccount } from "../api"
import { showSuccess } from "@/lib/feedback"

export function useDeleteAccount() {
  const stepUp = useStepUp()
  const logout = useLogout()

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      showSuccess("Your account has been deleted.")
      logout.mutate()
    },
  })

  async function run() {
    if (mutation.isPending) return
    try {
      const challengeId = await stepUp("account_delete")
      mutation.mutate(challengeId)
    } catch {}
  }

  return {
    run: () => void run(),
    deleting: mutation.isPending || logout.isPending,
  }
}
