"use client"

import { EllipsisIcon, LockIcon, UserRoundXIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { ShareSheet } from "@/features/share/components/share-sheet"
import { PinnedHeader } from "@/features/snaccs/components/card/card-labels"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { ReplyThread } from "@/features/snaccs/components/thread/reply-thread"
import {
  OwnProfileActions,
  ProfileActions,
} from "../components/profile-actions"
import { ProfileHeader } from "../components/profile-header"
import { ProfileHeaderSkeleton } from "../components/profile-header-skeleton"
import { ProfileMenuSheet } from "../components/profile-menu-sheet"
import { useProfileScreen } from "../hooks/use-profile-screen"
import { PROFILE_TABS } from "../utils/profile-tabs"

export function ProfileScreen({ username }: { username: string }) {
  const screen = useProfileScreen(username)
  const { header, timeline, snaccs, menu } = screen

  return (
    <>
      <BackHeader
        title={screen.title}
        onBack={screen.onBack}
        floating={screen.floating}
        right={
          screen.profile ? (
            <IconButton
              icon={EllipsisIcon}
              label="More"
              onClick={menu.onOpen}
            />
          ) : undefined
        }
      />

      {screen.notFound ? (
        <div className="py-24">
          <EmptyState
            icon={UserRoundXIcon}
            title="This account doesn't exist"
            description="The username may be wrong, or the account is gone."
          />
        </div>
      ) : screen.failed ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load this profile"
            onRetry={screen.retry}
          />
        </div>
      ) : !header ? (
        <div className="-mt-14">
          <ProfileHeaderSkeleton />
          <SkeletonRows count={5} item={SnaccCardSkeleton} />
        </div>
      ) : (
        <div className="-mt-14">
          <ProfileHeader
            {...header}
            actions={
              screen.isMe ? (
                <OwnProfileActions {...screen.own} />
              ) : screen.actions ? (
                <ProfileActions {...screen.actions} />
              ) : null
            }
          />

          {screen.locked ? (
            <EmptyState
              icon={LockIcon}
              title="This account is private"
              description="Follow them to see their snaccs."
              className="border-t border-border py-16"
            />
          ) : (
            <>
              <div className="sticky top-14 z-20 bg-background/90 backdrop-blur">
                <PillTabs
                  tabs={PROFILE_TABS}
                  value={screen.tabs.value}
                  onChange={screen.tabs.onChange}
                />
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
                  icon={screen.empty.icon ?? UserRoundXIcon}
                  title={screen.empty.title}
                  description={screen.empty.description}
                  className="py-24"
                />
              ) : (
                timeline.snaccs.map((item) => (
                  <ReplyThread
                    key={item.id}
                    snacc={item}
                    header={item.pinned ? <PinnedHeader /> : undefined}
                    votingPollFor={snaccs.votingPollFor}
                    itemRef={screen.trackRef(item.id)}
                    onOpenParent={screen.onOpenParent}
                    {...snaccs.handlers}
                  />
                ))
              )}
              <LoadMore
                onReach={timeline.loadMore}
                disabled={timeline.loading || timeline.loadingMore}
              />
              <ListFooter loading={timeline.loadingMore} />
            </>
          )}
        </div>
      )}

      <SnaccSheets {...snaccs.sheets} />
      <ProfileMenuSheet {...menu.sheet} />
      <ShareSheet {...menu.shareCard} />
      <ReportSheet {...menu.report} />
    </>
  )
}
