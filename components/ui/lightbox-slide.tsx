"use client"

import { useState, type CSSProperties, type Ref } from "react"
import { Spinner } from "@/components/ui/spinner"
import type { Size } from "@/lib/aspect"
import type { LightboxImage } from "@/lib/lightbox/images"

export function LightboxSlide({
  image,
  at,
  alt,
  layerRef,
  style,
  onLoaded,
}: {
  image: LightboxImage
  at: number
  alt: string
  layerRef?: Ref<HTMLDivElement>
  style?: CSSProperties
  onLoaded: (size: Size) => void
}) {
  const [ready, setReady] = useState(false)

  return (
    <div
      aria-hidden={at !== 0 || undefined}
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform: `translateX(${at * 100}%)` }}
    >
      <div
        ref={layerRef}
        className="relative size-full sm:h-[92dvh] sm:w-[96vw]"
        style={style}
      >
        {image.thumbUrl && !ready ? (
          <img
            src={image.thumbUrl}
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 size-full object-contain select-none"
          />
        ) : null}
        <img
          src={image.url}
          alt={alt}
          draggable={false}
          onLoad={(event) => {
            setReady(true)
            onLoaded({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })
          }}
          className="absolute inset-0 size-full object-contain select-none"
        />
      </div>

      {!ready && !image.thumbUrl ? (
        <Spinner className="absolute size-6 text-white" />
      ) : null}
    </div>
  )
}
