import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { ProfileHeaderSkeleton } from "@/features/users/components/profile-header-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="" floating />
      <div className="-mt-14">
        <ProfileHeaderSkeleton />
        <SkeletonRows count={5} item={SnaccCardSkeleton} />
      </div>
    </>
  )
}
