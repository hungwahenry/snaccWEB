"use client"

import { useState } from "react"
import { signal } from "@/features/signals/utils/queue"
import { aspectRatio } from "@/lib/aspect"
import { cn } from "@/lib/utils"
import type { SnaccGif } from "../../../types"
import { SpoilerVeil } from "./spoiler-veil"

export function SnaccGifView({
  gif,
  spoiler,
  snaccId,
}: {
  gif: SnaccGif
  spoiler?: boolean
  snaccId?: string
}) {
  const [revealed, setRevealed] = useState(false)
  const hidden = !!spoiler && !revealed

  return (
    <div
      role={hidden ? "button" : undefined}
      onClick={
        hidden
          ? (event) => {
              event.stopPropagation()
              signal("spoiler_reveal", { subjectId: snaccId })
              setRevealed(true)
            }
          : undefined
      }
      className="relative w-full overflow-hidden rounded-2xl bg-muted"
      style={{ aspectRatio: aspectRatio(gif) }}
    >
      <img
        src={gif.url}
        alt="GIF"
        loading="lazy"
        className={cn("size-full object-cover", hidden && "blur-2xl")}
      />
      {hidden ? <SpoilerVeil /> : null}
    </div>
  )
}
