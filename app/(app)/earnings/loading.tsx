import { EarningsSkeleton } from "@/features/earnings/components/earnings-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Monetisation" />
      <EarningsSkeleton />
    </>
  )
}
