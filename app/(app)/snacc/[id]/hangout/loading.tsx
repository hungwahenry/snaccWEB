import { HangoutBlockSkeleton } from "@/features/hangouts/components/block/hangout-block-skeleton"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Hangout info" />
      <div className="p-6">
        <HangoutBlockSkeleton />
      </div>
    </>
  )
}
