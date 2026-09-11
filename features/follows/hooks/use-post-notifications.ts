"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { PublicProfile } from "@/features/users/types"
import { userKeys } from "@/features/users/utils/keys"
import { showError, showSuccess } from "@/lib/feedback"
import { setPostNotifications } from "../api"

export function usePostNotifications(username: string) {
  const queryClient = useQueryClient()
  const key = userKeys.profile(username)

  return useMutation({
    mutationFn: (profile: PublicProfile) =>
      setPostNotifications(profile.id, !profile.notifying),
    onMutate: (profile) => {
      const previous = queryClient.getQueryData<PublicProfile>(key)
      queryClient.setQueryData<PublicProfile>(key, (current) =>
        current ? { ...current, notifying: !profile.notifying } : current
      )
      return { previous }
    },
    onSuccess: (_result, profile) =>
      showSuccess(
        profile.notifying ? "Notifications off" : "You'll hear when they post"
      ),
    onError: (error, _profile, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      showError(error)
    },
  })
}
