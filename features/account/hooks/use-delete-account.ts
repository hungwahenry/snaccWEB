"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { getErrorMessage } from "@/lib/api/errors"
import { useStepUp } from "@/providers/step-up-provider"
import { deleteAccount } from "../api"

export function useDeleteAccount() {
  const stepUp = useStepUp()
  const logout = useLogout()

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success("Your account has been deleted.")
      logout.mutate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
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
