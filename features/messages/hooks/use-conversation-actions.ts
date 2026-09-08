"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { blockGhost, revealSelf, unblockGhost } from "../api"
import { CONVERSATIONS_KEY, conversationKey } from "../utils/keys"

export function useConversationActions(id: string) {
  const queryClient = useQueryClient()

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: conversationKey(id) })
    void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })
  }

  const reveal = useMutation({
    mutationFn: () => revealSelf(id),
    onSuccess: (conversation) => {
      queryClient.setQueryData(conversationKey(id), conversation)
      void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })
      toast.success("You revealed yourself.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const block = useMutation({
    mutationFn: () => blockGhost(id),
    onSuccess: () => {
      refresh()
      toast.success("Blocked. They can no longer reach you.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const unblock = useMutation({
    mutationFn: () => unblockGhost(id),
    onSuccess: () => {
      refresh()
      toast.success("Unblocked. They can message you again.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return { reveal, block, unblock }
}
