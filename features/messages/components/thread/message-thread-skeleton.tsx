import { Fragment } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const BUBBLES: { mine: boolean; width: string; lines: number }[] = [
  { mine: false, width: "w-52", lines: 2 },
  { mine: false, width: "w-28", lines: 1 },
  { mine: true, width: "w-36", lines: 1 },
  { mine: false, width: "w-44", lines: 1 },
  { mine: true, width: "w-60", lines: 2 },
  { mine: true, width: "w-32", lines: 1 },
  { mine: false, width: "w-56", lines: 2 },
]

export function MessageThreadSkeleton() {
  return (
    <div className="flex flex-1 flex-col justify-end p-4">
      {BUBBLES.map((bubble, index) => {
        const startsBurst =
          index === 0 || BUBBLES[index - 1].mine !== bubble.mine
        return (
          <Fragment key={index}>
            {index === 3 ? (
              <div className="flex items-center gap-3 px-2 py-4">
                <span className="h-px flex-1 border-t border-dashed border-border" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <span className="h-px flex-1 border-t border-dashed border-border" />
              </div>
            ) : null}
            <div
              className={cn(
                "max-w-[80%]",
                bubble.mine ? "self-end" : "self-start",
                startsBurst && index !== 3 ? "mt-2" : "mt-0.5"
              )}
            >
              <Skeleton
                className={cn(
                  "rounded-2xl",
                  bubble.width,
                  bubble.lines === 2 ? "h-16" : "h-10"
                )}
              />
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
