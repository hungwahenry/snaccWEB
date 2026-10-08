"use client"

import { queryOptions, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getQueryClient } from "@/lib/query/client"
import { findConversationWith } from "../api"
import { conversationPath, newMessagePath } from "../routes"
import { messageKeys } from "../utils/keys"

type Target = { id: string; username: string | null }

const conversationWith = (userId: string) =>
  queryOptions({
    queryKey: messageKeys.conversationWith(userId),
    queryFn: () => findConversationWith(userId),
  })

export function useConversationWith(userId: string | null) {
  useQuery({ ...conversationWith(userId ?? ""), enabled: userId !== null })
}

export function useMessageUser() {
  const router = useRouter()

  return (target: Target) =>
    void getQueryClient()
      .ensureQueryData({
        ...conversationWith(target.id),
        revalidateIfStale: true,
      })
      .then(
        (conversationId) =>
          router.push(
            conversationId
              ? conversationPath(conversationId)
              : newMessagePath(target)
          ),
        () => router.push(newMessagePath(target))
      )
}
