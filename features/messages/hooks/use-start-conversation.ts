"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { startConversation } from "../api"
import { getQueryClient } from "@/lib/query/client"
import { setConversation } from "../cache"
import { conversationPath } from "../routes"
import { messageKeys } from "../utils/keys"

export function useStartConversation() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ targetId, body }: { targetId: string; body: string }) =>
      startConversation(targetId, body),
    onSuccess: (conversation, { targetId }) => {
      setConversation(conversation)
      getQueryClient().setQueryData(
        messageKeys.conversationWith(targetId),
        conversation.id
      )
      router.replace(conversationPath(conversation.id))
    },
  })
}
