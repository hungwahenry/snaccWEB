"use client"

import { useQuery } from "@tanstack/react-query"
import { getMomentsByAuthor } from "../api"
import { authorMomentsKey } from "../utils/keys"

export function useAuthorMoments(authorId: string) {
  return useQuery({
    queryKey: authorMomentsKey(authorId),
    queryFn: () => getMomentsByAuthor(authorId),
    enabled: Boolean(authorId),
    staleTime: Infinity,
    gcTime: 60_000,
  })
}
