import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"

const CARDS = [0, 1, 2]

export function MatchdaySkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Eyebrow className="px-1">Matchday</Eyebrow>
      <div className="-mx-(--gutter) flex gap-2.5 overflow-hidden px-[calc(var(--gutter)+4px)]">
        {CARDS.map((i) => (
          <Skeleton
            key={i}
            className="h-[120.5px] w-[220px] shrink-0 rounded-2xl"
          />
        ))}
      </div>
    </div>
  )
}
