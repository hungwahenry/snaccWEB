import { Skeleton } from "@/components/ui/skeleton"
import { ThreadConnector } from "./thread-connector"

export function ReplyContextSkeleton() {
  return (
    <div className="flex gap-3 px-4 pt-4">
      <div className="flex w-11 shrink-0 flex-col items-center">
        <Skeleton className="size-11 rounded-full" />
        <ThreadConnector className="min-h-6" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="my-1 h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div>
          <Skeleton className="my-1 h-4 w-full" />
          <Skeleton className="my-1 h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
