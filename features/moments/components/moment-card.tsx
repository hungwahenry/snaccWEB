import { Skeleton } from "@/components/ui/skeleton"
import type { Moment } from "../types"

export function MomentCard({
  moment,
  ready,
  onReady,
}: {
  moment: Moment
  ready: boolean
  onReady: (id: string) => void
}) {
  if (moment.image) {
    return (
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
        <div
          className="relative max-h-full w-full"
          style={{
            aspectRatio: `${moment.image.width} / ${moment.image.height}`,
          }}
        >
          {ready ? null : (
            <Skeleton className="absolute inset-0 rounded-none bg-white/10" />
          )}
          <img
            src={moment.image.url}
            alt=""
            draggable={false}
            onLoad={() => onReady(moment.id)}
            onError={() => onReady(moment.id)}
            className="absolute inset-0 size-full object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-1"
      style={{ backgroundColor: moment.background ?? "#000000" }}
    />
  )
}
