import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Saved" />
      <SkeletonRows count={6} item={SnaccCardSkeleton} />
    </>
  )
}
