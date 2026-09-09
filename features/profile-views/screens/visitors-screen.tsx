"use client"

import { FootprintsIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useIsPremium } from "@/features/premium/hooks/use-premium-limit"
import {
  FollowUserRow,
  FollowUserRowSkeleton,
} from "@/features/follows/components/follow-user-row"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useBack } from "@/hooks/use-back"
import { VisitorsLocked } from "../components/visitors-locked"
import { VisitorsUpsell } from "../components/visitors-upsell"
import { useProfileVisitors } from "../hooks/use-profile-visitors"
import { useVisitorSummary } from "../hooks/use-visitor-summary"

export function VisitorsScreen() {
  const back = useBack()
  const me = useMe()
  const {
    summary,
    loading,
    failed,
    retry,
    showVisitors,
    setShowVisitors,
    saving,
  } = useVisitorSummary()
  const list = useProfileVisitors(showVisitors)

  const anonymous = summary?.anonymous ?? 0
  const premium = useIsPremium()
  const offered = useFlag("premium")
  // The names beyond the free window. The count above the list stays the true one.
  const hidden = premium
    ? 0
    : Math.max((summary?.named ?? 0) - list.users.length, 0)

  return (
    <>
      <BackHeader
        title="Visitors"
        onBack={back}
        right={
          loading || failed ? undefined : (
            <Switch
              checked={showVisitors}
              disabled={saving}
              onCheckedChange={(checked) => setShowVisitors(checked)}
              aria-label="Show profile visitors"
            />
          )
        }
      />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="text-muted-foreground" />
        </div>
      ) : failed ? (
        <div className="py-24">
          <LoadFailed title="Could not load your visitors" onRetry={retry} />
        </div>
      ) : !showVisitors ? (
        <VisitorsLocked total={summary?.total ?? 0} />
      ) : (
        <>
          <div className="flex flex-col gap-1 px-4 pt-3 pb-1">
            <p className="text-sm text-muted-foreground">
              Works both ways — they see you when you visit theirs.
            </p>
            {list.users.length > 0 && anonymous > 0 ? (
              <p className="text-sm text-muted-foreground">
                {anonymous === 1
                  ? "1 more visitor is browsing privately."
                  : `${anonymous} more visitors are browsing privately.`}
              </p>
            ) : null}
          </div>

          {list.failed && list.users.length === 0 ? (
            <LoadFailed
              title="Could not load your visitors"
              onRetry={list.retry}
            />
          ) : list.loading ? (
            <SkeletonRows count={8} item={FollowUserRowSkeleton} />
          ) : list.users.length === 0 ? (
            <EmptyState
              icon={FootprintsIcon}
              title={
                anonymous > 0
                  ? `${anonymous} ${anonymous === 1 ? "person has" : "people have"} been by`
                  : "Nobody yet"
              }
              description={
                anonymous > 0
                  ? "None of them are sharing their name yet. They turn up here as they switch it on."
                  : "When someone opens your profile, they turn up here."
              }
              className="py-16"
            />
          ) : (
            list.users.map((user) => (
              <FollowUserRow
                key={user.id}
                user={user}
                isMe={me.data?.id === user.id}
                onToggleFollow={() => list.onToggleFollow(user)}
              />
            ))
          )}
          {offered ? <VisitorsUpsell hidden={hidden} /> : null}
          <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
          <ListFooter loading={list.loadingMore} />
        </>
      )}
    </>
  )
}
