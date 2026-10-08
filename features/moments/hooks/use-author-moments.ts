"use client"

import { useQuery } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query/client"
import { getMomentsByAuthor } from "../api"
import { openingImage } from "../utils/playback"
import { authorMomentsKey } from "../utils/keys"

const authorMoments = (authorId: string) => ({
  queryKey: authorMomentsKey(authorId),
  queryFn: () => getMomentsByAuthor(authorId),
  staleTime: Infinity,
  gcTime: 60_000,
})

export function useAuthorMoments(authorId: string) {
  return useQuery({ ...authorMoments(authorId), enabled: Boolean(authorId) })
}

export function prefetchAuthorMoments(authorId: string): void {
  void getQueryClient()
    .fetchQuery(authorMoments(authorId))
    .then((moments) => {
      const url = openingImage(moments)
      if (!url) return
      const image = new Image()
      image.src = url
    })
    .catch(() => undefined)
}
