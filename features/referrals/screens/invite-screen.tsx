"use client"

import { UserRoundPlusIcon, UserRoundXIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { InvitePanel } from "../components/invite-panel"
import { InviteSkeleton } from "../components/invite-skeleton"
import { InviteeRow, InviteeRowSkeleton } from "../components/invitee-row"
import { useInviteScreen } from "../hooks/use-invite-screen"

export function InviteScreen() {
  const { onBack, enabled, loading, failed, retry, list, panel } =
    useInviteScreen()

  if (enabled === false) {
    return (
      <>
        <BackHeader title="Invite friends" onBack={onBack} />
        <EmptyState
          icon={UserRoundXIcon}
          title="Not available"
          description="Inviting is switched off right now."
          className="py-24"
        />
      </>
    )
  }

  return (
    <>
      <BackHeader title="Invite friends" onBack={onBack} />

      {loading ? (
        <InviteSkeleton />
      ) : failed || !panel ? (
        <div className="py-24">
          <LoadFailed title="Could not load your invites" onRetry={retry} />
        </div>
      ) : (
        <>
          <InvitePanel {...panel} />

          {list.failed && list.items.length === 0 ? (
            <LoadFailed
              title="Could not load who joined"
              onRetry={list.retry}
            />
          ) : list.loading ? (
            <SkeletonRows count={3} item={InviteeRowSkeleton} />
          ) : list.items.length === 0 ? (
            <EmptyState
              icon={UserRoundPlusIcon}
              title="No one yet"
              description="Share your code. Every friend who joins and sticks around pays you both."
              compact
            />
          ) : (
            <>
              {list.items.map((invitee) => (
                <InviteeRow key={invitee.id} invitee={invitee} />
              ))}
              <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
              <ListFooter loading={list.loadingMore} />
            </>
          )}
        </>
      )}
    </>
  )
}
