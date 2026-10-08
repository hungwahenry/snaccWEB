import { LazyImage } from "@/components/ui/lazy-image"
import type { ConversationPhoto } from "../../types"

export function PhotoTile({
  photo,
  index,
  onOpen,
}: {
  photo: ConversationPhoto
  index: number
  onOpen: (index: number) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1}`}
      className="aspect-square overflow-hidden rounded-xl outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <LazyImage
        src={photo.image.thumb_url}
        alt=""
        className="size-full object-cover"
      />
    </button>
  )
}
