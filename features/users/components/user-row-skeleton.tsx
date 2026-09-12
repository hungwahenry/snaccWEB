import type { ReactNode } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function UserRowSkeleton({ trailing }: { trailing?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="my-1 h-4 w-32" />
        <Skeleton className="my-[3px] h-3.5 w-24" />
      </div>
      {trailing}
    </div>
  )
}
