import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { LADDER_HEADING } from "../utils/ladder-copy"

const RUNGS = Array.from({ length: 15 }, (_, rung) => rung)

export function ScoreLadderSkeleton() {
  return (
    <div className="flex flex-col gap-8 px-6 py-6">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-[60px] w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-[22px] rounded-full" />
          <Skeleton className="my-1 h-6 w-28" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-2.5 rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="my-0.5 h-3 w-16" />
          <Skeleton className="my-0.5 h-3 w-28" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Eyebrow>{LADDER_HEADING}</Eyebrow>
        <div className="flex flex-col gap-1">
          {RUNGS.map((rung) => (
            <div key={rung} className="flex items-center gap-3 px-3 py-2.5">
              <span className="flex w-6 justify-center">
                <Skeleton className="size-[18px] rounded-full" />
              </span>
              <span className="flex-1">
                <Skeleton className="my-1 h-4 w-24" />
              </span>
              <Skeleton className="my-[3px] h-3.5 w-10" />
              <span className="size-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
