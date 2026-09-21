"use client"

import { UsersRoundIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { FollowUserRow } from "@/features/follows/components/follow-user-row"
import { FollowUserRowSkeleton } from "@/features/follows/components/follow-user-row-skeleton"
import { BackHeader } from "@/features/navigation/components/back-header"
import { useHangoutMembersScreen } from "../hooks/joining/use-hangout-members-screen"

export function HangoutMembersScreen({ snaccId }: { snaccId: string }) {
  const { onBack, title, meId, list, onRemove } =
    useHangoutMembersScreen(snaccId)

  return (
    <>
      <BackHeader title={title} subtitle="Going" onBack={onBack} />

      {list.failed && list.users.length === 0 ? (
        <div className="py-24">
          <LoadFailed title="Could not load who's going" onRetry={list.retry} />
        </div>
      ) : list.loading ? (
        <SkeletonRows count={8} item={FollowUserRowSkeleton} />
      ) : list.users.length === 0 ? (
        <EmptyState
          icon={UsersRoundIcon}
          title="Nobody here"
          description="Nothing to show."
          className="py-24"
        />
      ) : (
        <>
          {list.users.map((user) => (
            <FollowUserRow
              key={user.id}
              user={user}
              isMe={meId === user.id}
              onToggleFollow={() => list.onToggleFollow(user)}
              onRemove={
                onRemove && meId !== user.id ? () => onRemove(user) : undefined
              }
            />
          ))}
          <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
          <ListFooter loading={list.loadingMore} />
        </>
      )}
    </>
  )
}
