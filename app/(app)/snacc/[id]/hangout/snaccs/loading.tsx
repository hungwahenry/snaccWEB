import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { HangoutBlockSkeleton } from "@/features/hangouts/components/block/hangout-block-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Hangout" />
      <div className="p-4">
        <HangoutBlockSkeleton />
      </div>
      <SkeletonRows count={4} item={SnaccCardSkeleton} />
    </>
  )
}
