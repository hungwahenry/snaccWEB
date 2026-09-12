import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { FollowRequestRowSkeleton } from "@/features/follows/components/follow-request-row-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { NOTIFICATIONS_PATH } from "@/features/notifications/routes"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Follow requests" fallback={NOTIFICATIONS_PATH} />
      <SkeletonRows count={6} item={FollowRequestRowSkeleton} />
    </>
  )
}
