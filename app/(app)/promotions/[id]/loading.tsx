import { PromotionSkeleton } from "@/features/ads/components/detail/promotion-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Promotion" />
      <PromotionSkeleton />
    </>
  )
}
