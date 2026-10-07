import { cn } from "@/lib/utils"

export const TAIL_REACH = 16

const CORNER = 16
const POINT = 7
const SHAPE =
  "M0 0H16V3C16 9.5 18 13.5 23 16C19.5 16.4 16 15.6 13 14C10.5 15.4 7 16 3 16H0Z"

export function BubbleTail({ mine }: { mine: boolean }) {
  return (
    <svg
      aria-hidden
      width={CORNER + POINT}
      height={CORNER}
      viewBox={`0 0 ${CORNER + POINT} ${CORNER}`}
      className={cn(
        "pointer-events-none absolute bottom-0",
        mine ? "fill-primary" : "-scale-x-100 fill-muted"
      )}
      style={mine ? { right: -POINT } : { left: -POINT }}
    >
      <path d={SHAPE} />
    </svg>
  )
}
