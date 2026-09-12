import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { MutedSkeleton } from "@/features/wallet/components/settings/muted-skeleton"
import { MONEY_SETTINGS_PATH } from "@/features/wallet/routes"

export default function Loading() {
  return (
    <>
      <RouteBackHeader
        title="Muted requesters"
        fallback={MONEY_SETTINGS_PATH}
      />
      <MutedSkeleton />
    </>
  )
}
