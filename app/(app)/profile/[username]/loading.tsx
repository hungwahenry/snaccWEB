import { ProfileHeaderSkeleton } from "@/features/users/components/profile-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { SkeletonRows } from "@/components/ui/skeleton-rows"

export default function Loading() {
  return (
    <>
      <ProfileHeaderSkeleton />
      <SkeletonRows count={4} item={SnaccCardSkeleton} />
    </>
  )
}
