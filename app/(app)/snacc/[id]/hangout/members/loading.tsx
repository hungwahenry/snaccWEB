import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { FollowUserRowSkeleton } from "@/features/follows/components/follow-user-row-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Going" />
      <SkeletonRows count={8} item={FollowUserRowSkeleton} />
    </>
  )
}
