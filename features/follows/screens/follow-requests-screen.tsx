"use client"

import { UserRoundPlusIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { FollowRequestRow } from "../components/follow-request-row"
import { FollowRequestRowSkeleton } from "../components/follow-request-row-skeleton"
import { useFollowRequestsScreen } from "../hooks/use-follow-requests-screen"

export function FollowRequestsScreen() {
  const { onBack, list, onAccept, onDecline } = useFollowRequestsScreen()

  return (
    <>
      <BackHeader title="Follow requests" onBack={onBack} />

      {list.failed && list.users.length === 0 ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load your follow requests"
            onRetry={list.retry}
          />
        </div>
      ) : list.loading ? (
        <SkeletonRows count={6} item={FollowRequestRowSkeleton} />
      ) : list.users.length === 0 ? (
        <EmptyState
          icon={UserRoundPlusIcon}
          title="No follow requests"
          description="When someone asks to follow your private account, they'll show up here."
          className="py-24"
        />
      ) : (
        <>
          {list.users.map((user) => (
            <FollowRequestRow
              key={user.id}
              user={user}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          ))}
          <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
          <ListFooter loading={list.loadingMore} />
        </>
      )}
    </>
  )
}
