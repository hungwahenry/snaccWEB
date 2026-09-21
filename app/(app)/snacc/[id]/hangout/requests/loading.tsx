import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { PersonRequestRowSkeleton } from "@/features/users/components/person-request-row-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Requests" />
      <SkeletonRows count={6} item={PersonRequestRowSkeleton} />
    </>
  )
}
