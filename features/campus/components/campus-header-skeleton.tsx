import { Skeleton } from "@/components/ui/skeleton"

export function CampusHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-4">
      <Skeleton className="size-14 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="my-1 h-5 w-48 max-w-full" />
        <Skeleton className="my-[3px] h-3.5 w-40 max-w-full" />
        <Skeleton className="mt-[7px] mb-[3px] h-3.5 w-32" />
      </div>
    </div>
  )
}
