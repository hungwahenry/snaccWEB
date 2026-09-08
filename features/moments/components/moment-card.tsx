import type { Moment } from "../types"

const CAPTION_LIFT = 24

export function MomentCard({
  moment,
  bottomClearance = 0,
}: {
  moment: Moment
  bottomClearance?: number
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
      <img
        src={moment.image.url}
        alt=""
        draggable={false}
        className="max-h-full w-full object-contain"
        style={{
          aspectRatio: `${moment.image.width} / ${moment.image.height}`,
        }}
      />

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
