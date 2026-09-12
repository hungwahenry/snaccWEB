import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { ReportRowSkeleton } from "@/features/reports/components/report-row-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Your reports" />
      <SkeletonRows count={6} item={ReportRowSkeleton} />
    </>
  )
}
