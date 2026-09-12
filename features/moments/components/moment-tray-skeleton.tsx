import { Skeleton } from "@/components/ui/skeleton"
import { TRAY_RING as RING, squircleRadius } from "../utils/shape"

const PLACEHOLDERS = 8

export function MomentTraySkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-4 py-3">
      {Array.from({ length: PLACEHOLDERS }, (_, at) => (
        <div
          key={at}
          className="flex w-16 shrink-0 flex-col items-center gap-1.5"
        >
          <Skeleton
            style={{
              width: RING,
              height: RING,
              borderRadius: squircleRadius(RING),
            }}
          />
          <Skeleton className="my-0.5 h-3 w-12" />
        </div>
      ))}
    </div>
  )
}
