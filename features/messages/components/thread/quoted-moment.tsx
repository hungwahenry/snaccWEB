import { cn } from "@/lib/utils"
import type { QuotedMoment } from "../../types"

export function QuotedMomentCard({
  moment,
  mine,
}: {
  moment: QuotedMoment
  mine: boolean
}) {
  const muted = mine ? "text-primary-foreground/55" : "text-muted-foreground"
  const label = mine ? "You replied to their moment" : "Replied to your moment"

  if (moment.expired || !moment.id) {
    return (
      <p
        className={cn("truncate px-3.5 pt-2.5 text-xs italic", muted)}
      >{`${label} · no longer available`}</p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1.5 px-2 pt-2.5 pb-1.5">
      <p className={cn("w-[124px] text-center text-[11px]", muted)}>{label}</p>
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: 124,
          height: 186,
          backgroundColor: moment.background ?? "#000",
        }}
      >
        {moment.image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={moment.image_url}
              alt=""
              className="size-full object-cover"
            />
            {moment.body ? (
              <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-black/45 px-2 py-1.5 text-[10px] leading-[13px] font-medium text-white">
                {moment.body}
              </p>
            ) : null}
          </>
        ) : (
          <p className="flex size-full items-center justify-center px-2.5 text-center text-[13px] leading-[17px] font-extrabold text-white">
            {moment.body}
          </p>
        )}
      </div>
    </div>
  )
}
