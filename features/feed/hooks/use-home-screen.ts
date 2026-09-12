"use client"

import { useMe } from "@/features/auth/hooks/use-me"
import { useBirthdayNudge } from "@/features/birthdays/hooks/use-birthday-nudge"
import { useBirthdayWish } from "@/features/birthdays/hooks/use-birthday-wish"
import { useFirstPostPrompt } from "@/features/first-post/hooks/use-first-post"
import { useMomentsStrip } from "@/features/moments/hooks/use-moments-strip"
import { useFeedScreen } from "./use-feed-screen"
import { useHomeChrome } from "./use-home-chrome"

export function useHomeScreen() {
  const feed = useFeedScreen()
  const profile = useMe().data?.profile
  const firstPost = useFirstPostPrompt()
  const moments = useMomentsStrip()
  const birthdayNudge = useBirthdayNudge()
  const birthdayWish = useBirthdayWish({ blocked: !birthdayNudge.resolved })
  const chrome = useHomeChrome()

  return {
    ...feed,
    exploreInHeader: chrome.exploreInHeader,
    list: {
      ...feed.list,
      findPeople: feed.list.findPeople && chrome.searchEnabled,
    },
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
    moneyFab: chrome.moneyFab,
  }
}
