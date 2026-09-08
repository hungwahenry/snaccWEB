"use client"

import { EllipsisIcon, UserRoundXIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { usePostNotifications } from "@/features/follows/hooks/use-post-notifications"
import { useToggleFollow } from "@/features/follows/hooks/use-toggle-follow"
import { useMessageUser } from "@/features/messages/hooks/use-message-user"
import { momentsPath } from "@/features/moments/routes"
import { useVisitorSummary } from "@/features/profile-views/hooks/use-visitor-summary"
import { payPath } from "@/features/wallet/routes"
import { useLightbox } from "@/providers/lightbox-provider"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { useMyScore } from "@/features/score/hooks/use-my-score"
import { useTier } from "@/features/score/hooks/use-tier"
import { ShareSheet } from "@/features/share/components/share-sheet"
import { PinnedHeader } from "@/features/snaccs/components/card/card-labels"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { ReplyThread } from "@/features/snaccs/components/thread/reply-thread"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { snaccPath } from "@/features/snaccs/routes"
import { useViewTracker } from "@/features/views/hooks/use-view-tracker"
import { useBack } from "@/hooks/use-back"
import { useScrolledPast } from "@/hooks/use-scrolled-past"
import { isNotFound } from "@/lib/api/errors"
import {
  ProfileHeader,
  ProfileHeaderSkeleton,
} from "../components/profile-header"
import { ProfileMenuSheet } from "../components/profile-menu-sheet"
import { useProfile } from "../hooks/use-profile"
import { useProfileMenu } from "../hooks/use-profile-menu"
import { useUserSnaccs } from "../hooks/use-user-snaccs"
import { followsPath } from "../routes"
import type { ProfileTab } from "../types"
import { DEFAULT_PROFILE_TAB, PROFILE_TABS } from "../utils/profile-tabs"

const COVER_DROP = 96

const EMPTY: Record<ProfileTab, string> = {
  snaccs: "No snaccs yet",
  replies: "No replies yet",
  media: "No media yet",
  resnaccs: "No resnaccs yet",
}

export function ProfileScreen({ username }: { username: string }) {
  const router = useRouter()
  const back = useBack()
  const query = useProfile(username)
  const me = useMe()
  const toggle = useToggleFollow(username)
  const notify = usePostNotifications(username)
  const [tab, setTab] = useState<ProfileTab>(DEFAULT_PROFILE_TAB)
  const timeline = useUserSnaccs(username, tab)
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const menu = useProfileMenu(query.data)
  const tracker = useViewTracker()
  const lightbox = useLightbox()
  const messageUser = useMessageUser()
  // The cover runs to the top of the page; the bar only arrives once it has scrolled away.
  const scrolled = useScrolledPast(COVER_DROP)

  const profile = query.data
  const isMe = !!profile && me.data?.id === profile.id
  const notFound = query.isError && isNotFound(query.error)
  const tier = useTier(profile?.score.tier)
  const myScore = useMyScore()
  const scoreEnabled = useFlag("score")
  const visitorsEnabled = useFlag("profile_visitors")
  const messagesEnabled = useFlag("anon_messages")
  const walletEnabled = useFlag("wallet")
  const momentsEnabled = useFlag("moments")
  const visitorSummary = useVisitorSummary(isMe && visitorsEnabled)

  const tabIcon =
    PROFILE_TABS.find((entry) => entry.value === tab)?.icon ?? UserRoundXIcon

  return (
    <>
      <BackHeader
        title={profile?.display_name ?? profile?.username ?? ""}
        onBack={back}
        floating={!scrolled}
        right={
          profile ? (
            <IconButton
              icon={EllipsisIcon}
              label="More"
              onClick={menu.onOpen}
            />
          ) : undefined
        }
      />

      {notFound ? (
        <div className="py-24">
          <EmptyState
            icon={UserRoundXIcon}
            title="This account doesn't exist"
            description="The username may be wrong, or the account is gone."
          />
        </div>
      ) : query.isError ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load this profile"
            onRetry={() => void query.refetch()}
          />
        </div>
      ) : !profile ? (
        <div className="-mt-14">
          <ProfileHeaderSkeleton />
          <SkeletonRows count={5} item={SnaccCardSkeleton} />
        </div>
      ) : (
        <div className="-mt-14">
          <ProfileHeader
            profile={profile}
            tier={tier}
            isMe={isMe}
            myStanding={isMe && scoreEnabled ? (myScore.data ?? null) : null}
            showScore={scoreEnabled}
            visitors={
              isMe && visitorsEnabled
                ? {
                    count: visitorSummary.summary?.total ?? 0,
                    loading: visitorSummary.loading,
                  }
                : null
            }
            showMessage={messagesEnabled}
            showPay={walletEnabled}
            onToggleFollow={() => toggle.mutate(profile)}
            onToggleNotify={() => notify.mutate(profile)}
            onMessage={() =>
              messageUser.mutate({ id: profile.id, username: profile.username })
            }
            onPay={() =>
              router.push(
                payPath({ mode: "send", to: profile.username ?? undefined })
              )
            }
            onEdit={() => router.push("/edit-profile")}
            onOpenAvatar={() =>
              lightbox.open({ images: [{ url: profile.avatar_url }], index: 0 })
            }
            ring={momentsEnabled ? profile.moments : null}
            onOpenMoments={() => router.push(momentsPath(profile.id))}
            followingHref={followsPath(profile.username ?? "", "following")}
            followersHref={followsPath(profile.username ?? "", "followers")}
          />

          <div className="sticky top-14 z-20 bg-background/90 backdrop-blur">
            <PillTabs tabs={PROFILE_TABS} value={tab} onChange={setTab} />
          </div>

          {timeline.failed && timeline.snaccs.length === 0 ? (
            <LoadFailed
              title="Could not load snaccs"
              onRetry={timeline.retry}
            />
          ) : timeline.loading ? (
            <SkeletonRows count={5} item={SnaccCardSkeleton} />
          ) : timeline.snaccs.length === 0 ? (
            <EmptyState
              icon={tabIcon}
              title={EMPTY[tab]}
              description="Nothing here yet."
              className="py-24"
            />
          ) : (
            timeline.snaccs.map((item) => (
              <ReplyThread
                key={item.id}
                snacc={item}
                header={item.pinned ? <PinnedHeader /> : undefined}
                votingPollFor={votingPollFor}
                itemRef={tracker.ref(item.id)}
                onOpenParent={(id) => router.push(snaccPath(id))}
                {...handlers}
              />
            ))
          )}
          <LoadMore
            onReach={timeline.loadMore}
            disabled={timeline.loading || timeline.loadingMore}
          />
          <ListFooter loading={timeline.loadingMore} />
        </div>
      )}

      <SnaccSheets {...sheets} />
      <ProfileMenuSheet {...menu.sheet} />
      <ShareSheet {...menu.shareCard} />
      <ReportSheet {...menu.report} />
    </>
  )
}
