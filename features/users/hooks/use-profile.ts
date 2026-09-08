"use client"

import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../api"

export function profileKey(username: string) {
  return ["users", "profile", username.toLowerCase()]
}

export function useProfile(username: string) {
  return useQuery({
    queryKey: profileKey(username),
    queryFn: () => getProfile(username),
    enabled: username.length > 0,
  })
}
