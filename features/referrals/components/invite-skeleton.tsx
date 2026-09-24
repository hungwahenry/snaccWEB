import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonRows } from "@/components/ui/skeleton-rows"
import { InviteeRowSkeleton } from "./invitee-row"

const STATS = [0, 1, 2]

export function InviteSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col items-center gap-2 px-6">
        <Eyebrow>Invite friends</Eyebrow>
        <Skeleton className="h-8 w-56 rounded-xl" />
        <Skeleton className="h-3 w-72" />
        <Skeleton className="h-3 w-52" />
      </div>

      <div className="mx-6 flex flex-col items-center gap-5 rounded-3xl bg-muted p-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-3 w-40" />
        <div className="flex w-full gap-3">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>

      <div className="flex gap-3 px-6">
        {STATS.map((stat) => (
          <Skeleton key={stat} className="h-16 flex-1 rounded-2xl" />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <Eyebrow className="px-6 pb-2">Friends who joined</Eyebrow>
        <SkeletonRows count={3} item={InviteeRowSkeleton} />
      </div>
    </div>
  )
}
