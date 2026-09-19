import { PlayIcon } from "lucide-react"
import type { SnaccClip } from "@/features/snaccs/types"
import { clock } from "@/features/voice/utils/clock"
import { aspectRatio } from "@/lib/aspect"
import { cn } from "@/lib/utils"
import { isReadyClip } from "../utils/viewer"
import { ClipPlayer } from "./clip-player"

type PublicClipProps = {
  clip: SnaccClip
  spoiler: boolean
  playable: boolean
}

export function PublicClip({ clip, spoiler, playable }: PublicClipProps) {
  if (!isReadyClip(clip)) return null
  if (playable) return <ClipPlayer clip={clip} spoiler={spoiler} />

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-muted"
      style={{ aspectRatio: aspectRatio(clip) }}
    >
      {clip.poster_thumb_url ? (
        <img
          src={clip.poster_thumb_url}
          alt=""
          className={cn(
            "size-full object-cover",
            spoiler && "scale-110 blur-2xl"
          )}
        />
      ) : null}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-black/45">
          <PlayIcon className="size-7 text-white" />
        </span>
      </span>
      <span className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white">
        {clock(clip.duration_ms)}
      </span>
    </div>
  )
}
