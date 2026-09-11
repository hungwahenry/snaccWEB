"use client"

import { useMutation } from "@tanstack/react-query"
import { signIn } from "../api"
import { meChanged } from "../cache"

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
    meta: { silent: true },
    onSuccess: (result) => meChanged(result.user),
  })
}
