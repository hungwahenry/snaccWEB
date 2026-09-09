import { ResnaccerRowSkeleton } from "@/features/snaccs/components/resnaccs/resnaccer-row"
import { SkeletonRows } from "@/components/ui/skeleton-rows"

export default function Loading() {
  return (
    <>
      <div className="h-14 border-b border-border" />
      <SkeletonRows count={8} item={ResnaccerRowSkeleton} />
    </>
  )
}
