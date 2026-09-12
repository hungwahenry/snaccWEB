import { Skeleton } from "@/components/ui/skeleton"
import { MATCH_ATTACHMENT_SHELL } from "./match-attachment-shell"

const SIDES = [0, 1]

export function MatchAttachmentSkeleton() {
  return (
    <div className={MATCH_ATTACHMENT_SHELL}>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="my-[3px] h-2.5 w-24" />
        <Skeleton className="h-2.5 w-8" />
      </div>
      {SIDES.map((side) => (
        <div key={side} className="flex items-center gap-2.5">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <Skeleton className="h-3.5 w-32" />
        </div>
      ))}
    </div>
  )
}
