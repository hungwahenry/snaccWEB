import { MomentThumb } from "@/features/moments/components/moment-thumb"
import { cn } from "@/lib/utils"
import type { QuotedMoment } from "../../types"
import { momentLabel } from "../../utils/glimpse"

export function QuotedMomentCard({
  moment,
  mine,
}: {
  moment: QuotedMoment
  mine: boolean
}) {
  const muted = mine ? "text-primary-foreground/55" : "text-muted-foreground"
  const gone = moment.expired || moment.id === null

  if (gone) {
    return (
      <p className={cn("truncate px-3.5 pt-2.5 text-xs italic", muted)}>
        {momentLabel(mine, true)}
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1.5 px-2 pt-2.5 pb-1.5">
      <p className={cn("w-[124px] text-center text-[11px]", muted)}>
        {momentLabel(mine, false)}
      </p>
      <MomentThumb
        body={moment.body}
        background={moment.background}
        imageUrl={moment.image_url}
      />
    </div>
  )
}
