"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { startConversation } from "../api"
import { conversationPath } from "../routes"
import { CONVERSATIONS_KEY, conversationKey } from "../utils/keys"

export function useStartConversation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ targetId, body }: { targetId: string; body: string }) =>
      startConversation(targetId, body),
    onSuccess: (conversation) => {
      queryClient.setQueryData(conversationKey(conversation.id), conversation)
      void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })
      router.replace(conversationPath(conversation.id))
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
