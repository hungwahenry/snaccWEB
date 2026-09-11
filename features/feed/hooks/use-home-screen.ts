"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { useBirthdayNudge } from "@/features/birthdays/hooks/use-birthday-nudge"
import { useBirthdayWish } from "@/features/birthdays/hooks/use-birthday-wish"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useFirstPostPrompt } from "@/features/first-post/hooks/use-first-post"
import { useMomentsStrip } from "@/features/moments/hooks/use-moments-strip"
import { useFeedScreen } from "./use-feed-screen"

export function useHomeScreen() {
  const feed = useFeedScreen()
  const profile = useMe().data?.profile
  const firstPost = useFirstPostPrompt()
  const moments = useMomentsStrip()
  const birthdayNudge = useBirthdayNudge()
  const birthdayWish = useBirthdayWish({ blocked: !birthdayNudge.resolved })
  const searchEnabled = useFlag("search")
  const messagesEnabled = useFlag("anon_messages")
  const walletEnabled = useFlag("wallet")

  return {
    ...feed,
    // With messages on, Explore gives up its tab, so it moves up here.
    exploreInHeader: searchEnabled && messagesEnabled,
    list: { ...feed.list, findPeople: feed.list.findPeople && searchEnabled },
    firstPost,
    moments,
    birthdayNudge: birthdayNudge.sheet,
    birthdayWish: {
      open: birthdayWish.open,
      onOpenChange: birthdayWish.onOpenChange,
      username: profile?.username ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    },
    birthdayFab: birthdayWish.showButton ? birthdayWish.onOpen : null,
    moneyFab: walletEnabled,
  }
}
