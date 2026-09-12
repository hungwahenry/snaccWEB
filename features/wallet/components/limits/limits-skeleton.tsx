import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import { LIMITS_HEADING, LIMITS_ROLLOVER, RAIL_LABELS } from "../../utils/limits"

const RAILS = Object.values(RAIL_LABELS)

export function LimitsSkeleton() {
  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <div className="flex flex-col gap-1">
        <Eyebrow>{LIMITS_HEADING}</Eyebrow>
        <Skeleton className="my-1 h-6 w-24" />
        <Skeleton className="my-[5px] h-3.5 w-72 max-w-full" />
      </div>

      <div className="flex flex-col gap-6">
        {RAILS.map((label) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{label}</span>
              <Skeleton className="h-3.5 w-32" />
            </div>
            <Skeleton className="h-2 rounded-full" />
          </div>
        ))}
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        {LIMITS_ROLLOVER}
      </p>
    </div>
  )
}
