import { cn } from "@/lib/utils"

export const TAIL_REACH = 16
export const TAIL_DROP = 6

const BIG = 10
const SMALL = 6

export function BubbleTail({ mine }: { mine: boolean }) {
  const tone = mine ? "bg-primary" : "bg-muted"
  const side = (offset: number) =>
    mine ? { right: -offset } : { left: -offset }

  return (
    <>
      <span
        className={cn("absolute rounded-full", tone)}
        style={{ width: BIG, height: BIG, bottom: 1, ...side(4) }}
      />
      <span
        className={cn("absolute rounded-full", tone)}
        style={{ width: SMALL, height: SMALL, bottom: -5, ...side(11) }}
      />
    </>
  )
}
