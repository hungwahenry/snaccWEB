import { useId } from "react"
import { cn } from "@/lib/utils"

const AMPLITUDE = 2.5
const PERIOD = 11
const STROKE = 1.5
const HEIGHT = AMPLITUDE * 2 + STROKE * 2

const MID = HEIGHT / 2
const QUARTER = PERIOD / 4
const HALF = PERIOD / 2
const WAVE = `M 0 ${MID} q ${QUARTER} ${-AMPLITUDE} ${HALF} 0 q ${QUARTER} ${AMPLITUDE} ${HALF} 0`

export function Squiggle({ className }: { className?: string }) {
  const id = useId()

  return (
    <svg
      aria-hidden
      className={cn("text-muted-foreground/50", className)}
      style={{ height: HEIGHT }}
      width="100%"
    >
      <defs>
        <pattern
          id={id}
          width={PERIOD}
          height={HEIGHT}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={WAVE}
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
