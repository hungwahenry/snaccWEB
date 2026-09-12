import { XIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function MomentPlayerSkeleton({ onClose }: { onClose?: () => void }) {
  return (
    <div className="relative h-full w-full bg-black">
      <div className="absolute inset-x-0 top-0 pt-[calc(env(safe-area-inset-top)+8px)]">
        <div className="flex gap-1 px-3">
          <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30" />
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full bg-white/20" />
            <div className="flex flex-col">
              <Skeleton className="my-[3px] h-3.5 w-24 bg-white/20" />
              <Skeleton className="my-0.5 h-3 w-10 bg-white/15" />
            </div>
          </div>

          <Skeleton className="m-1 size-5 rounded-full bg-white/15" />
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1 text-white"
            >
              <XIcon className="size-6" />
            </button>
          ) : (
            <Skeleton className="m-1 size-6 rounded-full bg-white/15" />
          )}
        </div>
      </div>
    </div>
  )
}
