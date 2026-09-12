import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { FollowUserRowSkeleton } from "@/features/follows/components/follow-user-row-skeleton"

export function VisitorsSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-1 px-4 pt-3 pb-1">
        <Skeleton className="my-[3px] h-3.5 w-72 max-w-full" />
      </div>
      <SkeletonRows count={8} item={FollowUserRowSkeleton} />
    </>
  )
}
