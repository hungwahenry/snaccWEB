import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100dvh-var(--tab-bar-height))] flex-col md:min-h-dvh">
      <RouteBackHeader title="" />
      <SkeletonRows count={5} item={SnaccCardSkeleton} />
    </div>
  )
}
