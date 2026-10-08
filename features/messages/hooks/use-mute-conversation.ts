"use client"

import { useMutation } from "@tanstack/react-query"
import { showError } from "@/lib/feedback"
import { muteConversation, unmuteConversation } from "../api"
import { findConversation, patchConversation } from "../cache"

export function useMuteConversation(id: string) {
  const mutation = useMutation({
    mutationFn: (muted: boolean) =>
      muted ? muteConversation(id) : unmuteConversation(id),
    onMutate: (muted) => {
      const before = findConversation(id)?.muted
      patchConversation(id, (conversation) => ({ ...conversation, muted }))
      return { before }
    },
    onError: (error, _muted, context) => {
      const before = context?.before
      if (before !== undefined) {
        patchConversation(id, (conversation) => ({
          ...conversation,
          muted: before,
        }))
      }
      showError(error)
    },
  })

  return (muted: boolean) => mutation.mutate(muted)
}
