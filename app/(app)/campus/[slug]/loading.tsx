import { CampusHeaderSkeleton } from "@/features/campus/components/campus-header"
import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { SkeletonRows } from "@/components/ui/skeleton-rows"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <CampusHeaderSkeleton />
      <SkeletonRows count={5} item={SnaccCardSkeleton} />
    </>
  )
}
