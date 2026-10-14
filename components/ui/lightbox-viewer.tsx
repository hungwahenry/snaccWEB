"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  StickerIcon,
  XIcon,
} from "lucide-react"
import { useEffect, useEffectEvent, useState, type ReactNode } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { LightboxSlide } from "@/components/ui/lightbox-slide"
import { Spinner } from "@/components/ui/spinner"
import { useLightboxGestures } from "@/hooks/use-lightbox-gestures"
import type { Size } from "@/lib/aspect"
import type { LightboxImage } from "@/lib/lightbox/images"
import { cn } from "@/lib/utils"

const OVERLAY_BUTTON =
  "bg-black/40 text-white hover:bg-black/60 disabled:opacity-50"

export function LightboxViewer({
  images,
  index,
  onIndex,
  onClose,
  saving,
  onSave,
  onMakeSticker,
  payCode,
  footer,
}: {
  images: LightboxImage[]
  index: number
  onIndex: (next: number) => void
  onClose: () => void
  saving: boolean
  onSave: (image: LightboxImage) => void
  onMakeSticker?: (image: LightboxImage) => void
  payCode?: ReactNode
  footer?: ReactNode
}) {
  const count = images.length
  const image = images[index]
  const [loaded, setLoaded] = useState<Record<string, Size>>({})
  const size =
    image?.width && image.height
      ? { width: image.width, height: image.height }
      : (loaded[image?.url ?? ""] ?? null)

  const {
    attach,
    attachImage,
    handlers,
    reset,
    chromeShown,
    backdropStyle,
    chromeStyle,
    pagerStyle,
    imageStyle,
  } = useLightboxGestures({
    size,
    hasPrevious: index > 0,
    hasNext: index < count - 1,
    onTurn: (by) => onIndex(index + by),
    onClose,
  })

  function step(by: number) {
    reset()
    onIndex(count === 0 ? 0 : (index + by + count) % count)
  }

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1)
    if (event.key === "ArrowLeft") step(-1)
  })

  useEffect(() => {
    if (count < 2) return
    const listener = (event: KeyboardEvent) => onKey(event)
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener)
  }, [count])

  const canMakeSticker = !!onMakeSticker && !!image?.width && !!image.height
  const slots = [-1, 0, 1]
    .map((at) => ({ at, slot: index + at }))
    .filter(({ slot }) => slot >= 0 && slot < count)
  const chrome = { inert: !chromeShown, style: chromeStyle }

  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-black/95"
        style={backdropStyle}
      />

      <div
        ref={attach}
        {...handlers}
        className="absolute inset-0 touch-none overflow-hidden select-none"
      >
        <div className="absolute inset-0" style={pagerStyle}>
          {slots.map(({ at, slot }) => (
            <LightboxSlide
              key={`${slot}:${images[slot].url}`}
              image={images[slot]}
              at={at}
              alt={count > 1 ? `Image ${slot + 1} of ${count}` : "Image"}
              layerRef={at === 0 ? attachImage : undefined}
              style={at === 0 ? imageStyle : undefined}
              onLoaded={(loadedSize) =>
                setLoaded((current) => ({
                  ...current,
                  [images[slot].url]: loadedSize,
                }))
              }
            />
          ))}
        </div>
      </div>

      <div
        {...chrome}
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)]"
      >
        <IconButton
          icon={XIcon}
          label="Close"
          onClick={onClose}
          className={cn("pointer-events-auto", OVERLAY_BUTTON)}
        />

        <div className="pointer-events-auto flex items-center gap-3">
          {count > 1 ? (
            <span className="rounded-full bg-black/40 px-3 py-1 text-sm font-bold text-white tabular-nums">
              {index + 1} / {count}
            </span>
          ) : null}

          {canMakeSticker ? (
            <IconButton
              icon={StickerIcon}
              label="Make a sticker"
              onClick={() => onMakeSticker(image)}
              className={OVERLAY_BUTTON}
            />
          ) : null}

          {image ? (
            saving ? (
              <span
                role="status"
                aria-label="Saving image"
                className="flex size-9 items-center justify-center rounded-full bg-black/40"
              >
                <Spinner className="text-white" />
              </span>
            ) : (
              <IconButton
                icon={DownloadIcon}
                label="Save image"
                onClick={() => onSave(image)}
                className={OVERLAY_BUTTON}
              />
            )
          ) : null}
        </div>
      </div>

      {count > 1 ? (
        <div {...chrome} className="pointer-events-none absolute inset-0">
          <IconButton
            icon={ChevronLeftIcon}
            label="Previous image"
            onClick={() => step(-1)}
            className={cn(
              "pointer-events-auto absolute top-1/2 left-4 -translate-y-1/2",
              OVERLAY_BUTTON
            )}
          />
          <IconButton
            icon={ChevronRightIcon}
            label="Next image"
            onClick={() => step(1)}
            className={cn(
              "pointer-events-auto absolute top-1/2 right-4 -translate-y-1/2",
              OVERLAY_BUTTON
            )}
          />
        </div>
      ) : null}

      <div
        {...chrome}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col"
      >
        {payCode ? (
          <div className="pointer-events-auto flex justify-center px-4 pb-3">
            {payCode}
          </div>
        ) : null}

        {footer ? (
          <div className="pointer-events-auto bg-gradient-to-t from-black/70 to-transparent px-5 pt-6 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
            {footer}
          </div>
        ) : null}
      </div>
    </>
  )
}
