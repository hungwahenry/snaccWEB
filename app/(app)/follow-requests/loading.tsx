import { FollowUserRowSkeleton } from "@/features/follows/components/follow-user-row"
import { SkeletonRows } from "@/components/ui/skeleton-rows"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <SkeletonRows count={6} item={FollowUserRowSkeleton} />
    </>
  )
}
