"use client"

import { useMutation } from "@tanstack/react-query"
import { showSuccess } from "@/lib/feedback"
import { blockGhost, revealSelf, unblockGhost } from "../api"
import { conversationChanged, setConversation } from "../cache"

export function useConversationActions(id: string) {
  const reveal = useMutation({
    mutationFn: () => revealSelf(id),
    onSuccess: (conversation) => {
      setConversation(conversation)
      showSuccess("You revealed yourself.")
    },
  })

  const block = useMutation({
    mutationFn: () => blockGhost(id),
    onSuccess: () => {
      conversationChanged(id)
      showSuccess("Blocked. They can no longer reach you.")
    },
  })

  const unblock = useMutation({
    mutationFn: () => unblockGhost(id),
    onSuccess: () => {
      conversationChanged(id)
      showSuccess("Unblocked. They can message you again.")
    },
  })

  return { reveal, block, unblock }
}
