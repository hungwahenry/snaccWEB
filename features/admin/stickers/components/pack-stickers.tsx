"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import type { PackSticker, PackStickerGroups, UploadProgress } from "../types"
import { stickersSummary } from "../utils/packs"
import { StickerTile } from "./sticker-tile"
import { StickerUploadButton, StickerUploadProgress } from "./sticker-upload"

const GRID = "grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6"

function CurateControls({
  sticker,
  onRemove,
}: {
  sticker: PackSticker
  onRemove: (id: string) => Promise<unknown>
}) {
  return (
    <CanAct permission="stickers.write">
      <ConfirmAction
        trigger={
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label="Take it out of the pack"
          >
            <Trash2 />
          </Button>
        }
        title="Take this sticker out of the pack?"
        description="It leaves the pack straight away. Anything already sent with it stays where it is."
        confirmLabel="Take it out"
        onConfirm={() => onRemove(sticker.id)}
      />
    </CanAct>
  )
}

export function PackStickers({
  groups,
  curate,
  progress,
  onUpload,
  onRemove,
}: {
  groups: PackStickerGroups
  curate: boolean
  progress: UploadProgress | null
  onUpload: (files: File[]) => Promise<unknown>
  onRemove: (id: string) => Promise<unknown>
}) {
  const { live, removed } = groups

  return (
    <Section
      title="Stickers"
      description={stickersSummary(groups)}
      action={
        curate ? (
          <StickerUploadButton
            uploading={progress !== null}
            onUpload={onUpload}
          />
        ) : null
      }
    >
      {progress ? <StickerUploadProgress progress={progress} /> : null}

      {live.length === 0 ? (
        <EmptyNote>
          {curate
            ? "No stickers yet. Add any images and they're fitted to sticker size; PNG or WebP keep a see-through background. You can pick several at once."
            : "No stickers in this pack."}
        </EmptyNote>
      ) : (
        <ul className={GRID}>
          {live.map((sticker) => (
            <StickerTile
              key={sticker.id}
              sticker={sticker}
              controls={
                curate ? (
                  <CurateControls sticker={sticker} onRemove={onRemove} />
                ) : null
              }
            />
          ))}
        </ul>
      )}

      {removed.length > 0 ? (
        <>
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">
            Removed by a moderator
          </h3>
          <ul className={GRID}>
            {removed.map((sticker) => (
              <StickerTile key={sticker.id} sticker={sticker} />
            ))}
          </ul>
        </>
      ) : null}
    </Section>
  )
}
