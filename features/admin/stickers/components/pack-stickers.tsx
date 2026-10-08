"use client"

import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import type {
  MoveDirection,
  PackSticker,
  PackStickerGroups,
  UploadProgress,
} from "../types"
import { stickersSummary } from "../utils/packs"
import { StickerTile } from "./sticker-tile"
import { StickerUploadButton, StickerUploadProgress } from "./sticker-upload"

const GRID = "grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6"

function CurateControls({
  sticker,
  first,
  last,
  onMove,
  onRemove,
}: {
  sticker: PackSticker
  first: boolean
  last: boolean
  onMove: (id: string, direction: MoveDirection) => Promise<unknown> | void
  onRemove: (id: string) => Promise<unknown>
}) {
  return (
    <>
      <div className="flex items-center">
        <CanAct permission="stickers.write">
          <ActionButton
            size="icon-xs"
            variant="ghost"
            disabled={first}
            aria-label="Move earlier"
            onClick={() => onMove(sticker.id, "earlier")}
          >
            <ArrowLeft />
          </ActionButton>
        </CanAct>
        <CanAct permission="stickers.write">
          <ActionButton
            size="icon-xs"
            variant="ghost"
            disabled={last}
            aria-label="Move later"
            onClick={() => onMove(sticker.id, "later")}
          >
            <ArrowRight />
          </ActionButton>
        </CanAct>
      </div>
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
    </>
  )
}

export function PackStickers({
  groups,
  curate,
  progress,
  onUpload,
  onMove,
  onRemove,
}: {
  groups: PackStickerGroups
  curate: boolean
  progress: UploadProgress | null
  onUpload: (files: File[]) => Promise<unknown>
  onMove: (id: string, direction: MoveDirection) => Promise<unknown> | void
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
            ? "No stickers yet. Add PNG or WebP images with a see-through background. You can pick several at once."
            : "No stickers in this pack."}
        </EmptyNote>
      ) : (
        <ul className={GRID}>
          {live.map((sticker, index) => (
            <StickerTile
              key={sticker.id}
              sticker={sticker}
              controls={
                curate ? (
                  <CurateControls
                    sticker={sticker}
                    first={index === 0}
                    last={index === live.length - 1}
                    onMove={onMove}
                    onRemove={onRemove}
                  />
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
