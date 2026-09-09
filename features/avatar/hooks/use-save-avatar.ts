"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { profileKey } from "@/features/users/hooks/use-profile"
import type { User } from "@/features/users/types"
import { api } from "@/lib/api/client"
import { getErrorMessage } from "@/lib/api/errors"
import { ME_KEY } from "@/lib/query-keys"
import type { AvatarOptions } from "../utils/catalog"

export function useSaveAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (options: AvatarOptions) =>
      api.patch<User>("/profile/avatar-options", { options }),
    onSuccess: (user) => {
      queryClient.setQueryData(ME_KEY, user)
      const username = user.profile?.username
      if (username) {
        void queryClient.invalidateQueries({ queryKey: profileKey(username) })
      }
      toast.success("Avatar updated.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
