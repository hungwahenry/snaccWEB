"use client"

import { UserRoundPlusIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BackHeader } from "@/features/navigation/components/back-header"
import { PersonRequestRow } from "@/features/users/components/person-request-row"
import { PersonRequestRowSkeleton } from "@/features/users/components/person-request-row-skeleton"
import { useHangoutRequestsScreen } from "../hooks/joining/use-hangout-requests-screen"

export function HangoutRequestsScreen({ snaccId }: { snaccId: string }) {
  const { onBack, title, list, onAccept, onDecline } =
    useHangoutRequestsScreen(snaccId)

  return (
    <>
      <BackHeader title={title} subtitle="Requests" onBack={onBack} />

      {list.failed && list.people.length === 0 ? (
        <div className="py-24">
          <LoadFailed
            title="Could not load the requests"
            onRetry={list.retry}
          />
        </div>
      ) : list.loading ? (
        <SkeletonRows count={6} item={PersonRequestRowSkeleton} />
      ) : list.people.length === 0 ? (
        <EmptyState
          icon={UserRoundPlusIcon}
          title="No requests"
          description="When someone asks to join, they'll show up here."
          className="py-24"
        />
      ) : (
        <>
          {list.people.map((person) => (
            <PersonRequestRow
              key={person.id}
              person={person}
              onAccept={onAccept}
              onDecline={onDecline}
              leadWithUsername
            />
          ))}
          <LoadMore onReach={list.loadMore} disabled={list.loadingMore} />
          <ListFooter loading={list.loadingMore} />
        </>
      )}
    </>
  )
}
