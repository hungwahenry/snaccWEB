import { XIcon } from "lucide-react"
import type { PickedImage } from "@/lib/media"

export function MessageDraftImages({
  images,
  onRemove,
}: {
  images: PickedImage[]
  onRemove: (uri: string) => void
}) {
  return (
    <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden">
      {images.map((image) => (
        <div
          key={image.uri}
          className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted"
        >
          <img src={image.uri} alt="" className="size-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(image.uri)}
            aria-label="Remove image"
            className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
