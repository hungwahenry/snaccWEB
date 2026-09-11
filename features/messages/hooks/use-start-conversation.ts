"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { startConversation } from "../api"
import { setConversation } from "../cache"
import { conversationPath } from "../routes"

export function useStartConversation() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ targetId, body }: { targetId: string; body: string }) =>
      startConversation(targetId, body),
    onSuccess: (conversation) => {
      setConversation(conversation)
      router.replace(conversationPath(conversation.id))
    },
  })
}
