import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"

const SIDES = [0, 1]
const FORM = [0, 1, 2, 3, 4]

function TeamBadgeSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <Skeleton className="size-11 rounded-full" />
      <Skeleton className="my-[3px] h-3.5 w-20" />
    </div>
  )
}

/** Shaped like what lands, so nothing shifts when it does. */
export function MatchDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex w-full items-center">
        <TeamBadgeSkeleton />
        <div className="flex flex-col items-center gap-1 px-3">
          <Skeleton className="my-1 h-8 w-24" />
          <Skeleton className="my-[3px] h-2.5 w-16" />
        </div>
        <TeamBadgeSkeleton />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-full" />
      </div>

      <div className="flex flex-col gap-2.5">
        <Eyebrow>Form</Eyebrow>
        {SIDES.map((side) => (
          <div key={side} className="flex items-center gap-2">
            <div className="w-14">
              <Skeleton className="my-[3px] h-3.5 w-10" />
            </div>
            <div className="flex gap-1.5">
              {FORM.map((game) => (
                <Skeleton key={game} className="size-7 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        <Eyebrow>Standings</Eyebrow>
        {SIDES.map((side) => (
          <div key={side} className="flex items-center gap-3">
            <div className="w-8">
              <Skeleton className="my-[3px] h-3.5 w-6" />
            </div>
            <div className="flex-1">
              <Skeleton className="my-[3px] h-3.5 w-28" />
            </div>
            <Skeleton className="my-[3px] h-3.5 w-28" />
          </div>
        ))}
      </div>
    </div>
  )
}
