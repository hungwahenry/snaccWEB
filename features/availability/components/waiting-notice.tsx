import { HourglassIcon } from "lucide-react"
import type { Availability } from "../types"
import { waitingLine, waitingTitle } from "../utils/notice"

export function WaitingNotice({
  availability,
}: {
  availability: Availability
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-muted">
        <HourglassIcon className="size-8 text-muted-foreground" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {waitingTitle(availability)}
        </h1>
        <p className="text-base leading-6 text-pretty text-muted-foreground">
          {waitingLine(availability)}
        </p>
      </div>
    </div>
  )
}
