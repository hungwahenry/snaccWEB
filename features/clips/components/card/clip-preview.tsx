"use client"

import { cn } from "@/lib/utils"
import { usePreviewVideo } from "../../hooks/autoplay/use-preview-video"

export function ClipPreview({ url }: { url: string }) {
  const preview = usePreviewVideo(url)

  return (
    <video
      {...preview.video}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden
      tabIndex={-1}
      className={cn(
        "pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-200",
        preview.shown ? "opacity-100" : "opacity-0"
      )}
    />
  )
}
