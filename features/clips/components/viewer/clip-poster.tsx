import type { SnaccClip } from "@/features/snaccs/types"
import { cn } from "@/lib/utils"
import { clipFit } from "../../utils/viewer"

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
        <img
          src={clip.poster_url}
          alt=""
          loading="lazy"
          draggable={false}
          className={cn(
            "size-full",
            clipFit(clip) === "cover" ? "object-cover" : "object-contain",
            veiled && "scale-110 blur-2xl"
          )}
        />
      ) : null}
    </div>
  )
}
