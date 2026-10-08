"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listConversationPhotos } from "../api"
import { messageKeys } from "../utils/keys"

export function useConversationPhotos(id: string) {
  return useInfiniteList(
    messageKeys.photos(id),
    (page) => listConversationPhotos(id, page),
    { enabled: id.length > 0 }
  )
}
