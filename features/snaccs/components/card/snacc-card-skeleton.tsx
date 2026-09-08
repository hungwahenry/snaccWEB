import { Skeleton } from "@/components/ui/skeleton"

export function SnaccCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4">
      <div className="flex gap-3">
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="flex gap-8 pl-14">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  )
}
