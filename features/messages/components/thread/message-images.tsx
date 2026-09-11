import { aspectRatio } from "@/lib/aspect"
import { countLabel } from "@/lib/format"
import type { ShownImage } from "../../types"

/** What the pile needs from an image: the same in a DM and in a room. */
export type ThreadImage = Pick<
  ShownImage,
  "id" | "url" | "thumb_url" | "width" | "height"
>

const MIN_RATIO = 3 / 4
const MAX_RATIO = 16 / 9
const WIDTH = 260
const TILTS = [4, -7]

export function MessageImages({
  images,
  onPressImage,
}: {
  images: ThreadImage[]
  onPressImage: (index: number) => void
}) {
  if (images.length === 0) return null

  const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, aspectRatio(images[0])))
  const height = Math.round(WIDTH / ratio)
  const card = { width: WIDTH, height, borderRadius: 18 }

  if (images.length === 1) {
    return (
      <button
        type="button"
        onClick={() => onPressImage(0)}
        className="block overflow-hidden transition-opacity active:opacity-80"
        style={card}
      >
        <img
          src={images[0].thumb_url ?? images[0].url}
          alt="Photo"
          className="size-full object-cover"
          loading="lazy"
        />
      </button>
    )
  }

  const behind = images.slice(1, 1 + TILTS.length).reverse()

  return (
    <button
      type="button"
      onClick={() => onPressImage(0)}
      aria-label={countLabel(images.length, "photo")}
      className="relative flex items-center justify-center transition-opacity active:opacity-80"
      style={{ width: WIDTH + 24, height: height + 24 }}
    >
      {behind.map((image, index) => (
        <img
          key={image.id}
          src={image.thumb_url ?? image.url}
          alt=""
          className="absolute object-cover shadow-sm"
          style={{
            ...card,
            transform: `rotate(${TILTS[behind.length - 1 - index]}deg)`,
          }}
          loading="lazy"
        />
      ))}
      <img
        src={images[0].thumb_url ?? images[0].url}
        alt=""
        className="relative object-cover shadow-sm"
        style={card}
        loading="lazy"
      />
      <span className="absolute right-5 bottom-5 rounded-full bg-foreground/70 px-2 py-0.5 text-[11px] font-bold text-background tabular-nums">
        {images.length}
      </span>
    </button>
  )
}
