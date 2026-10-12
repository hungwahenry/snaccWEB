import { NewPromotionSkeleton } from "@/features/ads/components/form/new-promotion-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Promote" />
      <NewPromotionSkeleton />
    </>
  )
}
