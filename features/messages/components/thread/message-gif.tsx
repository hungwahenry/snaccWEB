import type { MessageGif as Gif } from "../../types"

const WIDTH = 220
const MIN_RATIO = 3 / 4
const MAX_RATIO = 16 / 9

export function MessageGif({ gif }: { gif: Gif }) {
  const ratio = Math.min(
    MAX_RATIO,
    Math.max(MIN_RATIO, gif.height > 0 ? gif.width / gif.height : 1)
  )

  return (
    <div
      className="overflow-hidden rounded-2xl bg-muted"
      style={{ width: WIDTH, aspectRatio: ratio }}
    >
      <img
        src={gif.url}
        alt="GIF"
        className="size-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
