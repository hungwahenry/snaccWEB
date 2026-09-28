import { memo } from "react"
import type { ThreadLine } from "../../types"
import { DayBreak } from "./day-break"

function ThreadLineRowComponent({
  line,
  time,
  dayBreak,
}: {
  line: ThreadLine
  time: string | null
  dayBreak: string | null
}) {
  return (
    <>
      {dayBreak ? <DayBreak label={dayBreak} /> : null}

      <p className="px-6 py-2 text-center text-xs text-muted-foreground">
        {time ? `${line.text} · ${time}` : line.text}
      </p>
    </>
  )
}

export const ThreadLineRow = memo(ThreadLineRowComponent)
