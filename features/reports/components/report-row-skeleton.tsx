import { Skeleton } from "@/components/ui/skeleton"

export function ReportRowSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Skeleton className="my-[3px] h-3.5 w-32" />
        <Skeleton className="my-[3px] h-3.5 w-full" />
        <Skeleton className="my-0.5 h-3 w-12" />
      </div>
    </div>
  )
}
