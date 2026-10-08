import { Skeleton } from "@/components/ui/skeleton"

export function PackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="size-14 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="my-1 h-4 w-32" />
        <Skeleton className="my-[3px] h-3.5 w-40 max-w-full" />
      </div>
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
  )
}
