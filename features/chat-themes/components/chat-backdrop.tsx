import type { ChatPaint } from "../types"
import { backgroundOf } from "../utils/paint"

export function ChatBackdrop({
  paint,
  photoUrl,
}: {
  paint: ChatPaint
  photoUrl: string | null
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {paint.background ? (
        <div
          className="absolute inset-0"
          style={{ background: backgroundOf(paint.background) }}
        />
      ) : null}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      {paint.wash ? (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: paint.wash }}
        />
      ) : null}
    </div>
  )
}
