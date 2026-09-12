import { Skeleton } from "@/components/ui/skeleton"

export function TargetLineSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Skeleton className="size-6 shrink-0 rounded-full" />
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>To</span>
        <Skeleton className="my-[3px] h-3.5 w-20 rounded-full" />
      </div>
    </div>
  )
}
