"use client"

import { useState } from "react"
import { signal } from "@/features/signals/utils/queue"
import { useHoldAction } from "@/hooks/use-hold-action"
import { aspectRatio } from "@/lib/aspect"
import { cn } from "@/lib/utils"
import type { SnaccImage } from "../../../types"
import { SpoilerVeil } from "./spoiler-veil"

const SINGLE_MIN_RATIO = 3 / 4

type SnaccImagesProps = {
  images: SnaccImage[]
  spoiler?: boolean
  snaccId?: string
  onPressImage?: (index: number) => void
  onHoldImage?: (index: number) => void
}

export function SnaccImages({
  images,
  spoiler,
  snaccId,
  onPressImage,
  onHoldImage,
}: SnaccImagesProps) {
  const [revealed, setRevealed] = useState(false)
  if (images.length === 0) return null

  const hidden = !!spoiler && !revealed

  function press(event: React.MouseEvent, index: number) {
    event.stopPropagation()
    if (hidden) {
      signal("spoiler_reveal", { subjectId: snaccId })
      setRevealed(true)
      return
    }
    onPressImage?.(index)
  }

  const hold = (index: number) =>
    onHoldImage && !hidden ? () => onHoldImage(index) : undefined

  if (images.length === 1) {
    const image = images[0]
    return (
      <ImageTile
        onClick={(event) => press(event, 0)}
        onHold={hold(0)}
        aria-label={hidden ? "Reveal sensitive content" : "Open image"}
        className="relative block w-full overflow-hidden rounded-2xl bg-muted"
        style={{ aspectRatio: Math.max(aspectRatio(image), SINGLE_MIN_RATIO) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.thumb_url ?? image.url}
          alt=""
          loading="lazy"
          className={cn(
            "size-full object-cover transition-[filter]",
            hidden && "blur-2xl"
          )}
        />
        {hidden ? <SpoilerVeil /> : null}
      </ImageTile>
    )
  }

  const grid =
    images.length === 2
      ? "grid-cols-2"
      : images.length === 3
        ? "grid-cols-2 grid-rows-2"
        : "grid-cols-2 grid-rows-2"

  return (
    <div
      className={cn(
        "grid aspect-[16/10] gap-0.5 overflow-hidden rounded-2xl",
        grid
      )}
    >
      {images.slice(0, 4).map((image, index) => (
        <ImageTile
          key={image.position}
          onClick={(event) => press(event, index)}
          onHold={hold(index)}
          aria-label={
            hidden ? "Reveal sensitive content" : `Open image ${index + 1}`
          }
          className={cn(
            "relative block size-full overflow-hidden bg-muted",
            images.length === 3 && index === 0 && "row-span-2"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.thumb_url ?? image.url}
            alt=""
            loading="lazy"
            className={cn("size-full object-cover", hidden && "blur-2xl")}
          />
          {images.length > 4 && index === 3 ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-extrabold text-white">
              +{images.length - 4}
            </span>
          ) : null}
          {hidden && index === 0 ? <SpoilerVeil /> : null}
        </ImageTile>
      ))}
    </div>
  )
}

function ImageTile({
  onHold,
  className,
  ...props
}: React.ComponentProps<"button"> & { onHold?: () => void }) {
  const hold = useHoldAction(onHold)
  return (
    <button
      type="button"
      {...hold}
      {...props}
      className={cn(
        className,
        onHold &&
          "[@media(pointer:coarse)]:select-none [@media(pointer:coarse)]:[-webkit-touch-callout:none]"
      )}
    />
  )
}
