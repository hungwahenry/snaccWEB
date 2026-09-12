"use client"

import { useMutation } from "@tanstack/react-query"
import { refreshMe } from "@/features/auth/cache"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { updateMessageSettings } from "../api"

export function useMessageSettings() {
  const me = useMe()
  const shown = useFlag("anon_messages")
  const change = useMutation({
    mutationFn: (accept: boolean) => updateMessageSettings({ accept }),
    onSuccess: () => void refreshMe(),
  })

  return {
    shown,
    ready: !me.isPending && !change.isPending,
    acceptsAnonymous: me.data?.profile?.allow_anonymous_messages ?? true,
    setAcceptsAnonymous: (accept: boolean) => change.mutate(accept),
  }
}
