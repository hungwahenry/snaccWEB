import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { BlockedRowSkeleton } from "@/features/blocks/components/blocked-row-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Blocked accounts" />
      <div className="px-4">
        <SkeletonRows count={6} item={BlockedRowSkeleton} />
      </div>
    </>
  )
}
