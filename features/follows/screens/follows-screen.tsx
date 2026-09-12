"use client"

import { LockIcon, UserRoundCheckIcon, UsersRoundIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { PillTabs, type PillTab } from "@/components/ui/pill-tabs"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import {
  FollowUserRow,
  FollowUserRowSkeleton,
} from "../components/follow-user-row"
import { useFollowsScreen } from "../hooks/use-follows-screen"
import type { FollowTab } from "../types"

const TABS: PillTab<FollowTab>[] = [
  { value: "followers", label: "Followers", icon: UsersRoundIcon },
  { value: "following", label: "Following", icon: UserRoundCheckIcon },
]

const EMPTY: Record<FollowTab, string> = {
  followers: "No followers yet",
  following: "Not following anyone yet",
}

export function FollowsScreen({
  username,
  initialTab,
}: {
  username: string
  initialTab?: string
}) {
  const { onBack, tab, setTab, list, meId, locked, onRemove } =
    useFollowsScreen(username, initialTab)

  return (
    <>
      <BackHeader title={`@${username}`} onBack={onBack} />
      <PillTabs tabs={TABS} value={tab} onChange={setTab} />

      {list.failed && list.users.length === 0 ? (
        <LoadFailed title="Could not load this list" onRetry={list.retry} />
      ) : list.loading ? (
        <SkeletonRows count={8} item={FollowUserRowSkeleton} />
      ) : list.users.length === 0 ? (
        locked ? (
          <EmptyState
            icon={LockIcon}
            title="This account is private"
            description="Only their followers can see who they follow."
            className="py-24"
          />
        ) : (
          <EmptyState
            icon={UsersRoundIcon}
            title={EMPTY[tab]}
            description="Nothing here yet."
            className="py-24"
          />
        )
      ) : (
        <>
          {list.users.map((user) => (
            <FollowUserRow
              key={user.id}
              user={user}
              isMe={meId === user.id}
              onToggleFollow={() => list.onToggleFollow(user)}
              onRemove={onRemove ? () => onRemove(user) : undefined}
            />
          ))}
          <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
          <ListFooter loading={list.loadingMore} />
        </>
      )}
    </>
  )
}
