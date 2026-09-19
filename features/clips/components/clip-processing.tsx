import { ProgressRing } from "@/components/ui/progress-ring"
import type { SnaccClip } from "@/features/snaccs/types"
import { aspectRatio } from "@/lib/aspect"
import { clipStatusLabel, isUploading } from "../utils/clips"

type ClipProcessingProps = {
  clip: SnaccClip
  uploadProgress?: number
}

export function ClipProcessing({ clip, uploadProgress }: ClipProcessingProps) {
  const label = clipStatusLabel(uploadProgress)

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-muted"
      style={{ aspectRatio: aspectRatio(clip) }}
    >
      {clip.poster_thumb_url ? (
        <img
          src={clip.poster_thumb_url}
          alt=""
          className="size-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35">
        <ProgressRing
          progress={isUploading(uploadProgress) ? uploadProgress : null}
          size="lg"
          label={label}
        />
        <span className="text-xs font-bold text-white">{label}</span>
      </div>
    </div>
  )
}
