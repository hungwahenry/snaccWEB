"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { meChanged, patchMe, restoreMe } from "@/features/auth/cache"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { showError } from "@/lib/feedback"
import { setPrivacy } from "../api"

const COPY = {
  private: {
    title: "Make your account private?",
    message:
      "Only people you approve will see your snaccs, moments and follow lists. Everyone who follows you now keeps following.",
    action: "Make private",
  },
  public: {
    title: "Make your account public?",
    message:
      "Anyone can see your snaccs again, and everyone who asked to follow you gets in.",
    action: "Make public",
  },
} as const

export function usePrivateAccount() {
  const me = useMe()
  const enabled = useFlag("private_accounts")
  const change = useMutation({
    mutationFn: setPrivacy,
    onMutate: (isPrivate: boolean) => ({
      previous: patchMe((profile) => ({ ...profile, is_private: isPrivate })),
    }),
    onSuccess: (user) => meChanged(user),
    onError: (error, _isPrivate, context) => {
      restoreMe(context?.previous)
      showError(error)
    },
  })

  const profile = me.data?.profile

  return {
    // Snacc's own accounts post to everyone, so there is nothing to switch.
    shown: enabled && !profile?.official,
    ready: Boolean(profile) && !change.isPending,
    isPrivate: profile?.is_private ?? false,
    setPrivate: (isPrivate: boolean) => {
      const copy = COPY[isPrivate ? "private" : "public"]
      confirm({
        title: copy.title,
        message: copy.message,
        actions: [
          { label: copy.action, onPress: () => change.mutate(isPrivate) },
        ],
      })
    },
  }
}
