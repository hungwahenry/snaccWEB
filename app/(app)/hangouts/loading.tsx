import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { HOME_PATH } from "@/features/feed/routes"
import { HangoutCardSkeleton } from "@/features/hangouts/components/lists/hangout-card-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Hangouts" fallback={HOME_PATH} />
      <SkeletonRows count={4} item={HangoutCardSkeleton} />
    </>
  )
}
