import { Skeleton } from "@/components/ui/skeleton"

const PERKS = [0, 1, 2]

/** Shaped like the account card, the view a returning visitor lands on. */
export function ReceiveSkeleton() {
  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <Skeleton className="h-[226.5px] rounded-3xl" />

      <div className="flex flex-col gap-5 px-1">
        {PERKS.map((perk) => (
          <div key={perk} className="flex items-center gap-4">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col">
              <Skeleton className="my-1 h-4 w-36" />
              <Skeleton className="my-[3px] h-3.5 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
