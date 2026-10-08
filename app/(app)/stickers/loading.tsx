import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { RouteBackHeader } from "@/features/navigation/containers/route-back-header"
import { PackRowSkeleton } from "@/features/stickers/components/pack-row-skeleton"

export default function Loading() {
  return (
    <>
      <RouteBackHeader title="Sticker packs" />
      <SkeletonRows count={8} item={PackRowSkeleton} />
    </>
  )
}
