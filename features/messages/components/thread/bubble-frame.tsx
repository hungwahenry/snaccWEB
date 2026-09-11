import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { BubbleTail, TAIL_DROP, TAIL_REACH } from "./bubble-tail"

/** The shape every thread message takes, in a DM or a room: loose media on top, then the bubble
 * with its tail on the last of a run. What goes inside is the caller's. */
export function BubbleFrame({
  mine,
  firstInBurst,
  lastInBurst,
  sending,
  failed,
  media,
  bubbled,
  children,
}: {
  mine: boolean
  firstInBurst: boolean
  lastInBurst: boolean
  sending: boolean
  failed: boolean
  media?: ReactNode
  bubbled: boolean
  children?: ReactNode
}) {
  const corners = mine
    ? cn(!firstInBurst && "rounded-tr-md", !lastInBurst && "rounded-br-md")
    : cn(!firstInBurst && "rounded-tl-md", !lastInBurst && "rounded-bl-md")
  const tail = bubbled && lastInBurst && !failed

  return (
    <div
      className={cn("flex flex-col", mine ? "items-end" : "items-start")}
      style={{
        [mine ? "paddingRight" : "paddingLeft"]: TAIL_REACH,
        paddingBottom: tail ? TAIL_DROP : undefined,
      }}
    >
      <div
        className={cn(
          "flex flex-col gap-1",
          mine ? "items-end" : "items-start",
          sending && "opacity-60"
        )}
      >
        {media}

        {bubbled ? (
          <div className="relative">
            {tail ? <BubbleTail mine={mine} /> : null}

            <div
              className={cn(
                "overflow-hidden rounded-2xl",
                corners,
                mine ? "bg-primary" : "bg-muted"
              )}
            >
              {children}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
