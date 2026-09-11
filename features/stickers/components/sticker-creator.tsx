"use client"

import { useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"
import { CropStage } from "@/features/image-editor/components/crop-stage"
import type { CropRect, PickedImage } from "@/lib/media"
import { useCreatorStage } from "../hooks/use-creator-stage"

export type StickerCreatorProps = {
  image: PickedImage | null
  busy: boolean
  cancel: () => void
  create: (rect: CropRect) => void
}

export function StickerCreator(props: StickerCreatorProps) {
  if (!props.image) return null
  return <CreatorBody {...props} image={props.image} />
}

function CreatorBody({
  image,
  busy,
  cancel,
  create,
}: StickerCreatorProps & { image: PickedImage }) {
  const { side, measureFloor, next, onCropChange } = useCreatorStage({
    busy,
    onCreate: create,
  })

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") cancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticker-creator-title"
      className="fixed inset-0 z-[60] flex flex-col bg-black"
    >
      <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+8px)]">
        <button
          type="button"
          onClick={cancel}
          className="h-9 rounded-md px-1 text-base font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Cancel
        </button>
        <h2
          id="sticker-creator-title"
          className="text-base font-extrabold text-white"
        >
          Create sticker
        </h2>
        <button
          type="button"
          onClick={next}
          disabled={busy}
          autoFocus
          aria-busy={busy}
          className="flex h-9 min-w-14 items-center justify-center rounded-md px-1 text-base font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-70"
        >
          {busy ? <Spinner className="text-white" /> : "Create"}
        </button>
      </div>

      <div
        ref={measureFloor}
        className="flex min-h-0 flex-1 items-center justify-center"
      >
        {side > 0 ? (
          <CropStage
            image={image}
            stage={{ width: side, height: side }}
            aspect={1}
            onChange={onCropChange}
          />
        ) : null}
      </div>

      <p className="pb-[calc(env(safe-area-inset-bottom)+16px)] text-center text-sm text-white/70">
        Frame the part of the photo that matters.
      </p>
    </div>
  )
}
