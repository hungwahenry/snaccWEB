import { Skeleton } from "@/components/ui/skeleton"
import type { Moment } from "../types"

const CAPTION_LIFT = 24

export function MomentCard({
  moment,
  ready,
  bottomClearance = 0,
  onReady,
}: {
  moment: Moment
  ready: boolean
  bottomClearance?: number
  onReady: (id: string) => void
}) {
  if (!moment.image) {
    return (
      <div
        className="flex flex-1 items-center justify-center px-8"
        style={{ backgroundColor: moment.background ?? "#000000" }}
      >
        <p className="text-center text-3xl leading-10 font-extrabold break-words whitespace-pre-wrap text-white">
          {moment.body}
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
      <div
        className="relative max-h-full w-full"
        style={{
          aspectRatio: `${moment.image.width} / ${moment.image.height}`,
        }}
      >
        {ready ? null : (
          <Skeleton className="absolute inset-0 rounded-none" />
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

      {moment.body ? (
        <div
          className="absolute inset-x-0 bottom-0 bg-black/45 px-5 pt-4"
          style={{
            paddingBottom: `calc(max(env(safe-area-inset-bottom), ${bottomClearance}px) + ${CAPTION_LIFT}px)`,
          }}
        >
          <p className="text-base leading-6 font-medium whitespace-pre-wrap text-white">
            {moment.body}
          </p>
        </div>
      ) : null}
    </div>
  )
}
