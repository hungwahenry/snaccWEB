"use client"

import { Spinner } from "@/components/ui/spinner"
import { CropStage } from "@/features/image-editor/components/crop-stage"
import { useCreatorStage } from "../hooks/use-creator-stage"
import type { StickerCreator as Creator } from "../hooks/use-sticker-creator"

export function StickerCreator(props: Creator) {
  if (!props.image) return null
  return <CreatorBody {...props} />
}

function CreatorBody(props: Creator) {
  const { side, measureFloor, next, onCropChange } = useCreatorStage(props)
  if (!props.image) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+8px)]">
        <button
          type="button"
          onClick={props.cancel}
          className="h-9 text-base font-bold text-white"
        >
          Cancel
        </button>
        <span className="text-base font-extrabold text-white">
          Create Sticker
        </span>
        <button
          type="button"
          onClick={next}
          disabled={props.busy}
          className="flex h-9 items-center text-base font-bold text-white"
        >
          {props.busy ? <Spinner className="text-white" /> : "Create"}
        </button>
      </div>

      <div
        ref={measureFloor}
        className="flex flex-1 items-center justify-center"
      >
        {side > 0 ? (
          <CropStage
            image={props.image}
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
