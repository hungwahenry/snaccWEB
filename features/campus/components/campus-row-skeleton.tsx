import { Skeleton } from "@/components/ui/skeleton"

export function CampusRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="my-1 h-4 w-20" />
        <Skeleton className="my-[3px] h-3.5 w-48 max-w-full" />
      </div>
    </div>
  )
}
