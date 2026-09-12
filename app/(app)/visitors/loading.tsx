import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { VisitorsSkeleton } from "@/features/profile-views/components/visitors-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Visitors" />
      <VisitorsSkeleton />
    </>
  )
}
