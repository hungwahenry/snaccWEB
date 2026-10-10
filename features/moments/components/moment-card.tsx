import { Skeleton } from "@/components/ui/skeleton"
import type { Moment } from "../types"
import { sharesSnacc } from "../utils/shared"

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
  const caption = moment.body ? (
    <MomentCaption body={moment.body} bottomClearance={bottomClearance} />
  ) : null

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
        {caption}
      </div>
    )
  }

  if (sharesSnacc(moment)) {
    return (
      <div
        className="relative flex flex-1 overflow-hidden"
        style={{ backgroundColor: moment.background ?? "#000000" }}
      >
        {caption}
      </div>
    )
  }

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

function MomentCaption({
  body,
  bottomClearance,
}: {
  body: string
  bottomClearance: number
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 bg-black/45 px-5 pt-4"
      style={{
        paddingBottom: `calc(max(env(safe-area-inset-bottom), ${bottomClearance}px) + ${CAPTION_LIFT}px)`,
      }}
    >
      <p className="text-base leading-6 font-medium whitespace-pre-wrap text-white">
        {body}
      </p>
    </div>
  )
}
