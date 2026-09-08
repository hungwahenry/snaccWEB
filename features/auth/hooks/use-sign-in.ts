"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ME_KEY } from "@/lib/query-keys"
import { signIn } from "@/features/auth/api"

export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signIn,
    onSuccess: (result) => queryClient.setQueryData(ME_KEY, result.user),
  })
}
