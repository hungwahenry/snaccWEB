import { XIcon } from "lucide-react"
import type { PickedImage } from "@/lib/media"

export function MomentAttachment({
  image,
  onRemove,
}: {
  image: PickedImage | null
  onRemove: () => void
}) {
  if (!image) return null

  return (
    <div className="flex gap-3 px-2">
      <div className="relative size-28 overflow-hidden rounded-2xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.uri} alt="" className="size-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove photo"
          className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-opacity active:opacity-70"
        >
          <XIcon className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
