"use client"

import { VolumeXIcon } from "lucide-react"
import Link from "next/link"
import { LazyImage } from "@/components/ui/lazy-image"
import { SpoilerVeil } from "@/features/snaccs/components/card/media/spoiler-veil"
import type { SnaccClip } from "@/features/snaccs/types"
import { clock } from "@/features/voice/utils/clock"
import { aspectRatio } from "@/lib/aspect"
import { cn } from "@/lib/utils"
import { useClipCard } from "../../hooks/card/use-clip-card"
import { isReadyClip } from "../../utils/viewer"
import { ClipPlayer } from "../clip-player"
import { ClipProcessing } from "../clip-processing"
import { ClipPreview } from "./clip-preview"

const FRAME = "relative block w-full overflow-hidden rounded-2xl bg-muted"

type ClipCardProps = {
  clip: SnaccClip
  spoiler?: boolean
  snaccId?: string
  uploadProgress?: number
}

export function ClipCard(props: ClipCardProps) {
  const { clip, uploadProgress } = props
  const { watch, ...card } = useClipCard(props)
  const shape = { aspectRatio: aspectRatio(clip) }

  if (!isReadyClip(clip)) {
    return <ClipProcessing clip={clip} uploadProgress={uploadProgress} />
  }

  if (!card.href) return <ClipPlayer {...props} />

  if (card.hidden) {
    return (
      <button
        type="button"
        aria-label="Reveal sensitive content"
        onClick={(event) => {
          event.stopPropagation()
          card.reveal()
        }}
        style={shape}
        className={cn(FRAME, "cursor-pointer")}
      >
        <Poster url={clip.poster_thumb_url} blurred />
        <SpoilerVeil />
      </button>
    )
  }

  return (
    <Link
      ref={watch}
      href={card.href}
      aria-label="Watch clip"
      onClick={(event) => {
        event.stopPropagation()
        card.open()
      }}
      style={shape}
      className={FRAME}
    >
      <Poster url={clip.poster_thumb_url} />
      {card.previewUrl ? <ClipPreview url={card.previewUrl} /> : null}
      {card.previewUrl ? (
        <span className="absolute bottom-2 left-2 flex size-6 items-center justify-center rounded-full bg-black/55">
          <VolumeXIcon className="size-3.5 text-white" />
        </span>
      ) : null}
      <span className="absolute right-2 bottom-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white">
        {clock(clip.duration_ms)}
      </span>
    </Link>
  )
}

function Poster({ url, blurred }: { url: string | null; blurred?: boolean }) {
  if (!url) return null

  return (
    <LazyImage
      src={url}
      alt=""
      className={cn("size-full object-cover", blurred && "scale-110 blur-2xl")}
    />
  )
}
