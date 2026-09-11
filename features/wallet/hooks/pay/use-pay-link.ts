"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { bareLink, copyLink, shareLink, shareOrCopy } from "@/lib/share-links"

export function usePayLink() {
  const me = useMe()
  const profile = me.data?.profile
  const username = profile?.username
  if (!username) return null

  const link = shareLink.pay(username)
  return {
    username,
    link,
    shownLink: bareLink(link),
    avatarUrl: profile?.avatar_url ?? null,
    onCopy: () => void copyLink(link, "Your pay link"),
    onShare: () =>
      void shareOrCopy(link, "Send me money on Snacc 💸", "Your pay link"),
  }
}
