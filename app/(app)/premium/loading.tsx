import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { PremiumSkeleton } from "@/features/premium/components/premium-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Premium" />
      <PremiumSkeleton />
    </>
  )
}
