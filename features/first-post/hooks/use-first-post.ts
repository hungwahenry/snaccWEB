"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import type { User } from "@/features/users/types"
import { ME_KEY } from "@/lib/query-keys"

export function useFirstPostPrompt() {
  const me = useMe()
  const enabled = useFlag("first_post_prompt")
  const queryClient = useQueryClient()

  const profile = me.data?.profile
  const completed = profile?.completed_at != null
  const hasPosted = (profile?.snaccs_count ?? 1) > 0

  return {
    show: enabled && completed && !hasPosted,
    markPosted() {
      queryClient.setQueryData<User>(ME_KEY, (old) =>
        old?.profile
          ? {
              ...old,
              profile: {
                ...old.profile,
                snaccs_count: old.profile.snaccs_count + 1,
              },
            }
          : old
      )
    },
  }
}
