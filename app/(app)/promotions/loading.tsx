import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { CampaignRowSkeleton } from "@/features/ads/components/list/campaign-row-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Your promotions" />
      <SkeletonRows count={6} item={CampaignRowSkeleton} />
    </>
  )
}
