"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userKeys } from "@/features/users/utils/keys"
import type { User } from "@/features/users/types"
import { api } from "@/lib/api/client"
import { authKeys } from "@/features/auth/utils/keys"
import type { AvatarOptions } from "../utils/catalog"
import { showSuccess } from "@/lib/feedback"

export function useSaveAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (options: AvatarOptions) =>
      api.patch<User>("/profile/avatar-options", { options }),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      const username = user.profile?.username
      if (username) {
        void queryClient.invalidateQueries({
          queryKey: userKeys.profile(username),
        })
      }
      showSuccess("Avatar updated.")
    },
  })
}
