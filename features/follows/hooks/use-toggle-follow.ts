"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { profileKey } from "@/features/users/hooks/use-profile"
import type { PublicProfile } from "@/features/users/types"
import { getErrorMessage } from "@/lib/api/errors"
import { followUser, unfollowUser } from "../api"

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient()
  const key = profileKey(username)

  return useMutation({
    mutationFn: (profile: PublicProfile) =>
      profile.is_following ? unfollowUser(profile.id) : followUser(profile.id),
    onMutate: (profile) => {
      const previous = queryClient.getQueryData<PublicProfile>(key)
      const following = !profile.is_following

      queryClient.setQueryData<PublicProfile>(key, (current) =>
        current
          ? {
              ...current,
              is_following: following,
              followers_count: Math.max(
                0,
                current.followers_count + (following ? 1 : -1)
              ),
            }
          : current
      )
      return { previous }
    },
    onError: (error, _profile, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      toast.error(getErrorMessage(error))
    },
  })
}
