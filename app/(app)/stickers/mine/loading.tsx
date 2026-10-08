import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { PackRowSkeleton } from "@/features/stickers/components/pack-row-skeleton"
import { STICKERS_PATH } from "@/features/stickers/routes"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Your packs" fallback={STICKERS_PATH} />
      <SkeletonRows count={3} item={PackRowSkeleton} />
    </>
  )
}
