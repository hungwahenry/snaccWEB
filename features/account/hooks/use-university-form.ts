"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { useCampusPicker } from "@/features/universities/hooks/use-campus-picker"
import type { Profile } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { authKeys } from "@/features/auth/utils/keys"
import { changeUniversity } from "../api"
import { showSuccess } from "@/lib/feedback"

export function useUniversityForm(profile: Profile) {
  const back = useBack("/edit-profile")
  const queryClient = useQueryClient()
  const picker = useCampusPicker()
  const { selected } = picker

  const change = useMutation({
    mutationFn: changeUniversity,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== authKeys.me()[0],
      })
      showSuccess("Campus updated.")
      back()
    },
  })

  const valid = selected !== null && selected.id !== profile.university?.id

  return {
    locked: profile.university_locked,
    currentName: profile.university?.name ?? null,
    picker,
    valid,
    submitting: change.isPending,
    onSubmit: () => {
      if (!valid || !selected || change.isPending) return
      if (selected.open) {
        change.mutate(selected.id)
        return
      }

      confirm({
        title: `${selected.name} isn't on Snacc yet`,
        message:
          "You'll wait until it opens, and this uses your one campus change. Until then your feed, messages and wallet will be out of reach. We'll email you when it opens.",
        cancelLabel: "Keep my campus",
        actions: [
          {
            label: "Move anyway",
            destructive: true,
            onPress: () => change.mutate(selected.id),
          },
        ],
      })
    },
  }
}
