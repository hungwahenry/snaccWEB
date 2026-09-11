"use client"

import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../api"
import { userKeys } from "../utils/keys"

export function useProfile(username: string) {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn: () => getProfile(username),
    enabled: username.length > 0,
  })
}
