import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { EARNINGS_COPY } from "../utils/earnings-copy"

const MILESTONES = [0, 1, 2]
const TOP = [0, 1, 2]

export function EarningsSkeleton() {
  return (
    <div className="pb-8">
      <div className="flex flex-col gap-6 px-6 pt-8">
        <div className="flex flex-col items-center gap-1.5">
          <Eyebrow>{EARNINGS_COPY.eyebrow}</Eyebrow>
          <Skeleton className="h-[60px] w-44" />
          <p className="text-center text-sm text-muted-foreground">
            {EARNINGS_COPY.caption}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <span className="text-lg font-extrabold text-foreground">
              {EARNINGS_COPY.milestones}
            </span>
            <Skeleton className="my-[3px] h-3.5 w-16" />
          </div>
          {MILESTONES.map((milestone) => (
            <div key={milestone} className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="my-1 h-4 w-32" />
                  <Skeleton className="my-[3px] h-3.5 w-12" />
                </div>
                <Skeleton className="h-3 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">
              {EARNINGS_COPY.fund}
            </span>
            <Skeleton className="my-[3px] h-3.5 w-24" />
          </div>
          <Skeleton className="h-2.5 rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="my-[3px] h-3.5 w-20" />
            <Skeleton className="my-[3px] h-3.5 w-20" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Eyebrow>{EARNINGS_COPY.top}</Eyebrow>
          {TOP.map((row) => (
            <div key={row} className="flex items-center gap-3">
              <Skeleton className="my-1.5 h-4 w-5" />
              <Skeleton className="my-[3px] h-3.5 flex-1" />
              <Skeleton className="my-[3px] h-3.5 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
