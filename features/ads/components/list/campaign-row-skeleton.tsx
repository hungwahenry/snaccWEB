import { Skeleton } from "@/components/ui/skeleton"

export function CampaignRowSkeleton() {
  return (
    <div className="flex gap-3 border-b border-border px-4 py-3.5">
      <Skeleton className="size-14 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="my-[3px] h-3.5 w-40" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="my-0.5 h-3 w-32" />
        <Skeleton className="my-0.5 h-3 w-48" />
      </div>
    </div>
  )
}
