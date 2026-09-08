import { Skeleton } from "@/components/ui/skeleton"
import { AVATAR_SIZE, squircleRadius } from "../utils/shape"

const PLACEHOLDERS = 5
const RING = AVATAR_SIZE + 9

export function MomentTraySkeleton() {
  return (
    <div className="flex gap-4 px-4 py-3">
      {Array.from({ length: PLACEHOLDERS }, (_, at) => (
        <div key={at} className="flex w-16 flex-col items-center gap-1.5">
          <Skeleton
            style={{
              width: RING,
              height: RING,
              borderRadius: squircleRadius(RING),
            }}
          />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}
