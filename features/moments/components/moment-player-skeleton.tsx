import { Skeleton } from "@/components/ui/skeleton"

export function MomentPlayerSkeleton() {
  return (
    <div className="relative h-full w-full bg-black">
      <div className="absolute inset-x-0 top-0 pt-[calc(env(safe-area-inset-top)+8px)]">
        <div className="flex gap-1 px-3">
          <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30" />
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="size-8 rounded-full bg-white/20" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-24 bg-white/20" />
            <Skeleton className="h-2.5 w-10 bg-white/15" />
          </div>
        </div>
      </div>
    </div>
  )
}
