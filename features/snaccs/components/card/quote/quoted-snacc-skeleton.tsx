import { Skeleton } from "@/components/ui/skeleton"

export function QuotedSnaccSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-1.5">
        <Skeleton className="size-5 shrink-0 rounded-full" />
        <Skeleton className="my-[3px] h-3.5 w-28" />
      </div>
      <div className="flex flex-col">
        <Skeleton className="my-[3px] h-3.5 w-full" />
        <Skeleton className="my-[3px] h-3.5 w-2/3" />
      </div>
    </div>
  )
}
