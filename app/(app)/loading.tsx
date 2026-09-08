import { SnaccCardSkeleton } from "@/features/snaccs/components/card/snacc-card-skeleton"
import { SkeletonRows } from "@/components/ui/skeleton-rows"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <SkeletonRows count={6} item={SnaccCardSkeleton} />
    </>
  )
}
