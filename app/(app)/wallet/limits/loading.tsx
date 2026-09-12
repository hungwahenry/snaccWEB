import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { LimitsSkeleton } from "@/features/wallet/components/limits/limits-skeleton"
import { MONEY_SETTINGS_PATH } from "@/features/wallet/routes"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Your limits" fallback={MONEY_SETTINGS_PATH} />
      <LimitsSkeleton />
    </>
  )
}
