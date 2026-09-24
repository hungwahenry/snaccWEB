import { LazyImage } from "@/components/ui/lazy-image"
import type { SnaccClip } from "@/features/snaccs/types"
import { cn } from "@/lib/utils"

type ClipPosterProps = {
  clip: SnaccClip
  height: number
  veiled: boolean
}

export function ClipPoster({ clip, height, veiled }: ClipPosterProps) {
  return (
    <div
      style={{ height }}
      className="snap-start snap-always overflow-hidden bg-black"
    >
      {clip.poster_url ? (
        <LazyImage
          src={clip.poster_url}
          alt=""
          draggable={false}
          className={cn(
            "size-full object-contain",
            veiled && "scale-110 blur-2xl"
          )}
        />
      ) : null}
    </div>
  )
}
