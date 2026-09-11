"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { clearPendingChatMessages } from "@/features/chats/cache/pending-chat-messages"
import { clearPendingMessages } from "@/features/messages/cache/pending-messages"
import { LANDING_PATH } from "@/lib/routes"
import { signOut } from "../api"

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      // Nothing half-sent may go out later under whoever signs in next.
      clearPendingMessages()
      clearPendingChatMessages()
      queryClient.clear()
      router.replace(LANDING_PATH)
    },
  })
}
