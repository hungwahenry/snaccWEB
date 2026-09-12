import { Skeleton } from "@/components/ui/skeleton"
import { EGGS_APP_NOTE } from "../utils/eggs-copy"

const ROWS = [0, 1, 2, 3, 4, 5, 6, 7]

export function EggsSkeleton() {
  return (
    <div className="flex flex-col pt-2 pb-6">
      <div className="px-6 pb-2">
        <Skeleton className="my-[3px] h-3.5 w-52" />
      </div>
      <p className="px-6 pb-3 text-xs text-muted-foreground">{EGGS_APP_NOTE}</p>

      {ROWS.map((row) => (
        <div
          key={row}
          className="flex items-center gap-3 border-b border-border px-6 py-3"
        >
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-0.5">
            <Skeleton className="my-1 h-4 w-28" />
            <Skeleton className="my-[3px] h-3.5 w-full max-w-sm" />
            <Skeleton className="my-0.5 h-3 w-36" />
          </div>
          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}
