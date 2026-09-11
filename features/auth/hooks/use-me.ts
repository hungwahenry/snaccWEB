"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getMe } from "../api"
import { authKeys } from "../utils/keys"

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 5 * MINUTE_MS,
  })
}
