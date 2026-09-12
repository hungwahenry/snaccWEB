import { Skeleton } from "@/components/ui/skeleton"

export function ComposerFrameSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="my-1 h-4 w-28" />
        <div className="flex min-h-32 flex-col py-1">
          <Skeleton className="my-1 h-5 w-full" />
          <Skeleton className="my-1 h-5 w-2/3" />
        </div>
      </div>
    </div>
  )
}
