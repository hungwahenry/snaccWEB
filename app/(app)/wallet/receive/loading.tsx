import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { ReceiveSkeleton } from "@/features/wallet/components/receive/receive-skeleton"
import { WALLET_PATH } from "@/features/wallet/routes"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Account number" fallback={WALLET_PATH} />
      <ReceiveSkeleton />
    </>
  )
}
