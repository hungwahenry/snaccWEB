"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { signOut } from "@/features/auth/api"

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      queryClient.clear()
      router.replace("/")
    },
  })
}
