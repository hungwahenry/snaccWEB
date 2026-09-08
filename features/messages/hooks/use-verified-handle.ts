"use client"

import { useQuery } from "@tanstack/react-query"
import { getProfile } from "@/features/users/api"

/// The handle in the link is just a label, so it is only shown once the profile it names turns
/// out to be the account the message would actually reach.
export function useVerifiedHandle(
  targetId: string,
  claimed: string | null
): string | null {
  const { data } = useQuery({
    queryKey: ["users", "profile", claimed],
    queryFn: () => getProfile(claimed!),
    enabled: !!claimed,
    retry: false,
  })

  return data?.id === targetId ? (data.username ?? null) : null
}
