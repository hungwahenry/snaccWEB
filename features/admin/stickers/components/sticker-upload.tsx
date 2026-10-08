"use client"

import { ImagePlus } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import type { UploadProgress } from "../types"
import {
  progressLabel,
  progressValue,
  STICKER_FILE_TYPES,
} from "../utils/packs"

export function StickerUploadButton({
  uploading,
  onUpload,
}: {
  uploading: boolean
  onUpload: (files: File[]) => Promise<unknown>
}) {
  const input = useRef<HTMLInputElement>(null)

  return (
    <>
      <CanAct permission="stickers.write">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => input.current?.click()}
        >
          {uploading ? <Spinner /> : <ImagePlus />}
          Add stickers
        </Button>
      </CanAct>
      <input
        ref={input}
        type="file"
        accept={STICKER_FILE_TYPES}
        multiple
        tabIndex={-1}
        disabled={uploading}
        className="sr-only"
        aria-label="Sticker images"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          event.target.value = ""
          void onUpload(files)
        }}
      />
    </>
  )
}

export function StickerUploadProgress({
  progress,
}: {
  progress: UploadProgress
}) {
  return (
    <Progress value={progressValue(progress)} className="rounded-lg border p-3">
      <ProgressLabel>{progressLabel(progress)}</ProgressLabel>
    </Progress>
  )
}
