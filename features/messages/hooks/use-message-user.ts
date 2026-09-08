"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { findConversationWith } from "../api"
import { conversationPath, newMessagePath } from "../routes"

type Target = { id: string; username: string | null }

export function useMessageUser() {
  const router = useRouter()

  return useMutation({
    mutationFn: (target: Target) => findConversationWith(target.id),
    onSuccess: (conversationId, target) => {
      router.push(
        conversationId
          ? conversationPath(conversationId)
          : newMessagePath(target)
      )
    },
    onError: (_error, target) => router.push(newMessagePath(target)),
  })
}
