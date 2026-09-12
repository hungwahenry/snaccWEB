"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { EDIT_PROFILE_PATH } from "@/features/account/routes"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useFollowToggle } from "@/features/follows/hooks/use-follow-toggle"
import { usePostNotifications } from "@/features/follows/hooks/use-post-notifications"
import { followsPath } from "@/features/follows/routes"
import { followButtonLabel } from "@/features/follows/utils/follow-state"
import { useMessageUser } from "@/features/messages/hooks/use-message-user"
import { momentsPath } from "@/features/moments/routes"
import { useVisitorSummary } from "@/features/profile-views/hooks/use-visitor-summary"
import { useMyScore } from "@/features/score/hooks/use-my-score"
import { useTier } from "@/features/score/hooks/use-tier"
import { SCORE_PATH } from "@/features/score/routes"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { useSnaccTracker } from "@/features/snaccs/hooks/use-snacc-tracker"
import { snaccPath } from "@/features/snaccs/routes"
import { payPath } from "@/features/wallet/routes"
import { useBack } from "@/hooks/use-back"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { useScrolledPast } from "@/hooks/use-scrolled-past"
import { isNotFound } from "@/lib/api/errors"
import { useLightbox } from "@/providers/lightbox-provider"
import { realtimeRooms } from "@/providers/realtime-rooms"
import type { ProfileTab } from "../types"
import { handleOf, nameOf } from "../utils/names"
import {
  avatarLabel,
  notifyLabel,
  profileMeta,
  profileStats,
} from "../utils/profile"
import {
  DEFAULT_PROFILE_TAB,
  profileEmpty,
  profileTab,
} from "../utils/profile-tabs"
import { useProfile } from "./use-profile"
import { useProfileMenu } from "./use-profile-menu"
import { useUserSnaccs } from "./use-user-snaccs"

/** How far the cover runs before the bar arrives over it. */
const COVER_DROP = 96

export function useProfileScreen(username: string) {
  const router = useRouter()
  const back = useBack()
  const query = useProfile(username)
  const me = useMe()
  const toggleFollow = useFollowToggle()
  const notify = usePostNotifications(username)
  const [tab, setTab] = useState<ProfileTab>(DEFAULT_PROFILE_TAB)
  const snaccs = useSnaccActions()
  const menu = useProfileMenu(query.data)
  const tracker = useSnaccTracker()
  const lightbox = useLightbox()
  const messageUser = useMessageUser()
  const scrolled = useScrolledPast(COVER_DROP)

  const profile = query.data ?? null
  useRealtimeRoom(
    profile?.username ? realtimeRooms.profile(profile.username) : null
  )
  const isMe = profile !== null && me.data?.id === profile.id
  const locked = profile !== null && !isMe && !profile.can_view
  const timeline = useUserSnaccs(username, tab, !locked)
  const tier = useTier(profile?.score.tier)
  const myScore = useMyScore()
  const scoreEnabled = useFlag("score")
  const visitorsEnabled = useFlag("profile_visitors")
  const messagesEnabled = useFlag("anon_messages")
  const walletEnabled = useFlag("wallet")
  const momentsEnabled = useFlag("moments")
  const visitors = useVisitorSummary(isMe && visitorsEnabled)

  const ring = momentsEnabled ? (profile?.moments ?? null) : null
  const handle = profile ? handleOf(profile) : null

  return {
    title: profile ? nameOf(profile) : "",
    onBack: back,
    floating: !scrolled,
    notFound: query.isError && isNotFound(query.error),
    failed: query.isError && !isNotFound(query.error),
    retry: () => void query.refetch(),
    profile,
    isMe,
    locked,
    header: profile
      ? {
          profile,
          tint: tier?.color ?? null,
          ring,
          avatarLabel: avatarLabel(profile, ring !== null),
          meta: profileMeta(profile),
          score: !scoreEnabled
            ? null
            : isMe && myScore.data
              ? {
                  tier: myScore.data.tier,
                  points: myScore.data.score,
                  href: SCORE_PATH,
                }
              : { tier },
          stats: profileStats(
            profile,
            profile.username && !locked
              ? {
                  following: followsPath(profile.username, "following"),
                  followers: followsPath(profile.username, "followers"),
                }
              : {}
          ),
          onPressAvatar: ring
            ? () => router.push(momentsPath(profile.id))
            : () =>
                lightbox.open({
                  images: [{ url: profile.avatar_url }],
                  index: 0,
                }),
        }
      : null,
    own: {
      visitors: visitorsEnabled
        ? { count: visitors.summary?.total ?? 0, loading: visitors.loading }
        : null,
      onEdit: () => router.push(EDIT_PROFILE_PATH),
    },
    actions: profile
      ? {
          payLabel: walletEnabled && handle ? `Send money to ${handle}` : null,
          messageLabel:
            messagesEnabled && profile.accepts_anonymous_messages
              ? "Send anonymous message"
              : null,
          followState: profile.follow_state,
          notifying: profile.notifying,
          notifyLabel: notifyLabel(profile.notifying),
          followLabel: followButtonLabel(
            profile.follow_state,
            profile.follows_you
          ),
          onPay: () =>
            router.push(
              payPath({ mode: "send", to: profile.username ?? undefined })
            ),
          onMessage: () =>
            messageUser.mutate({ id: profile.id, username: profile.username }),
          onToggleNotify: () => notify.mutate(profile),
          onToggleFollow: () => toggleFollow(profile),
        }
      : null,
    tabs: { value: tab, onChange: setTab },
    timeline,
    empty: { ...profileEmpty(tab, isMe), icon: profileTab(tab).icon },
    snaccs,
    trackRef: tracker.ref,
    onOpenParent: (id: string) => router.push(snaccPath(id)),
    menu,
  }
}
