"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  StickerIcon,
  XIcon,
} from "lucide-react"
import { useCallback, useEffect, type ReactNode } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"
import { useImageZoom } from "@/hooks/use-image-zoom"
import { cn } from "@/lib/utils"

export interface LightboxImage {
  url: string
  width?: number
  height?: number
}

const OVERLAY_BUTTON =
  "bg-black/40 text-white hover:bg-black/60 disabled:opacity-50"

/** One picture at a time, full screen: arrows or keys to move, double click or wheel to zoom. */
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
  const { attach, reset, style, zoomed, handlers } = useImageZoom()
  const count = images.length
  const image = images[index]

  const step = useCallback(
    (by: number) => {
      reset()
      onIndex(count === 0 ? 0 : (index + by + count) % count)
    },
    [count, index, onIndex, reset]
  )

  useEffect(() => {
    if (count < 2) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [count, step])

  const canMakeSticker = !!onMakeSticker && !!image?.width && !!image.height

  return (
    <>
      <div
        ref={attach}
        {...handlers}
        className="flex size-full touch-none items-center justify-center overflow-hidden"
      >
        {image ? (
          <img
            src={image.url}
            alt={count > 1 ? `Image ${index + 1} of ${count}` : "Image"}
            draggable={false}
            style={style}
            className={cn(
              "object-contain select-none",
              zoomed
                ? "max-h-dvh max-w-full cursor-grab active:cursor-grabbing"
                : "max-h-[92dvh] max-w-[96vw]"
            )}
          />
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)]">
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
        <>
          <IconButton
            icon={ChevronLeftIcon}
            label="Previous image"
            onClick={() => step(-1)}
            className={cn(
              "absolute top-1/2 left-4 -translate-y-1/2",
              OVERLAY_BUTTON
            )}
          />
          <IconButton
            icon={ChevronRightIcon}
            label="Next image"
            onClick={() => step(1)}
            className={cn(
              "absolute top-1/2 right-4 -translate-y-1/2",
              OVERLAY_BUTTON
            )}
          />
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col">
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
