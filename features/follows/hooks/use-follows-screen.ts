"use client"

import { useState } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useProfile } from "@/features/users/hooks/use-profile"
import { useBack } from "@/hooks/use-back"
import type { FollowTab } from "../types"
import { useFollowList } from "./use-follow-list"
import { useRemoveFollower } from "./use-remove-follower"

export function useFollowsScreen(username: string, initialTab?: string) {
  const back = useBack()
  const [tab, setTab] = useState<FollowTab>(
    initialTab === "following" ? "following" : "followers"
  )
  const list = useFollowList(username, tab)
  const profile = useProfile(username).data
  const me = useMe().data
  const meId = me?.id
  const removeFollower = useRemoveFollower()

  return {
    onBack: back,
    tab,
    setTab,
    list,
    meId,
    locked: !!profile && !profile.can_view && profile.id !== meId,
    /** Your own followers: each row can be removed. */
    onRemove:
      tab === "followers" &&
      me?.profile?.username?.toLowerCase() === username.toLowerCase()
        ? removeFollower
        : undefined,
  }
}
