import { PencilIcon, XIcon } from "lucide-react"
import type { ClipDraft } from "@/features/clips/types"
import type { Gif } from "@/features/giphy/types"
import { MatchAttachment } from "@/features/football/components/match-attachment"
import type { SnaccMatch } from "@/features/football/types"
import { HangoutTagChip } from "@/features/hangouts/components/tagging/hangout-tag-chip"
import type { HangoutTag } from "@/features/hangouts/types"
import { StickerAttachmentView } from "@/features/stickers/components/sticker-attachment-view"
import type { DraftSticker } from "@/features/stickers/types"
import { VoiceComposerPanel } from "@/features/voice/components/voice-composer-panel"
import type { VoiceDraft } from "@/features/voice/types"
import { clock } from "@/features/voice/utils/clock"
import { aspectRatio } from "@/lib/aspect"
import { cn } from "@/lib/utils"
import type { DraftImage, SnaccVoiceNote } from "../../types"
import { draftImageKey, draftImageUri } from "../../utils/draft-images"
import { SpoilerToggle } from "./spoiler-toggle"

const STICKER_PREVIEW = 120

function CornerButton({
  onPress,
  label,
  icon: Icon,
  side,
}: {
  onPress: () => void
  label: string
  icon: typeof XIcon
  side: "left" | "right"
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className={
        side === "right"
          ? "absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow active:opacity-70"
          : "absolute bottom-2 left-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow active:opacity-70"
      }
    >
      <Icon className="size-4" />
    </button>
  )
}

export type ComposerVoice = {
  recording: boolean
  durationMs: number
  levels: number[]
  live: MediaStream | null
  draft: VoiceDraft | null
  onStop: () => void
  onDiscard: () => void
}

export function ComposerAttachments({
  images,
  gif,
  sticker = null,
  storedVoice,
  voice = null,
  clip = null,
  onRemoveImage,
  onEditImage,
  onRemoveGif,
  onRemoveSticker,
  onRemoveClip,
  onClipCover,
  match,
  onRemoveMatch,
  hangoutTag,
  onRemoveHangoutTag,
  showSpoiler = false,
  spoiler = false,
  onToggleSpoiler,
}: {
  images: DraftImage[]
  gif: Gif | null
  sticker?: DraftSticker | null
  storedVoice: SnaccVoiceNote | null
  voice?: ComposerVoice | null
  clip?: ClipDraft | null
  onRemoveImage: (key: string) => void
  onEditImage?: (key: string) => void
  onRemoveGif: () => void
  onRemoveSticker?: () => void
  onRemoveClip?: () => void
  onClipCover?: (ms: number) => void
  match?: SnaccMatch | null
  onRemoveMatch?: () => void
  hangoutTag?: HangoutTag | null
  onRemoveHangoutTag?: () => void
  showSpoiler?: boolean
  spoiler?: boolean
  onToggleSpoiler?: () => void
}) {
  const hasVoice = !!storedVoice || !!voice?.recording || !!voice?.draft
  if (
    !gif &&
    !sticker &&
    !clip &&
    images.length === 0 &&
    !hasVoice &&
    !match &&
    !hangoutTag
  )
    return null

  return (
    <>
      {hangoutTag ? (
        <div className="flex px-4 pt-3">
          <HangoutTagChip tag={hangoutTag} onRemove={onRemoveHangoutTag} />
        </div>
      ) : null}
      {clip ? (
        <div className="flex px-4 pt-3">
          <div
            className="relative overflow-hidden rounded-2xl bg-muted"
            style={{
              height: 140,
              aspectRatio: aspectRatio(clip),
              maxWidth: "100%",
            }}
          >
            {clip.posterUrl ? (
              <img
                src={clip.posterUrl}
                alt=""
                className={cn("size-full object-cover", spoiler && "blur-2xl")}
              />
            ) : null}
            <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-bold text-white">
              {clock(clip.durationMs)}
            </span>
            {onRemoveClip ? (
              <CornerButton
                onPress={onRemoveClip}
                label="Remove clip"
                icon={XIcon}
                side="right"
              />
            ) : null}
          </div>
          {onClipCover ? (
            <label className="ml-4 flex min-w-0 flex-1 flex-col justify-center gap-2">
              <span className="text-sm font-bold text-foreground">Cover</span>
              <input
                key={`${clip.file.size}-${clip.durationMs}`}
                type="range"
                min={0}
                max={clip.durationMs}
                step={100}
                defaultValue={clip.coverMs ?? 0}
                onPointerUp={(event) =>
                  onClipCover(Number(event.currentTarget.value))
                }
                onKeyUp={(event) =>
                  onClipCover(Number(event.currentTarget.value))
                }
                className="w-full accent-primary"
              />
              <span className="text-xs text-muted-foreground">
                Slide to pick the frame people see first.
              </span>
            </label>
          ) : null}
        </div>
      ) : null}
      {match ? (
        <div className="relative px-4 pt-3">
          <MatchAttachment match={match} interactive={false} />
          {onRemoveMatch ? (
            <CornerButton
              onPress={onRemoveMatch}
              label="Remove match"
              icon={XIcon}
              side="right"
            />
          ) : null}
        </div>
      ) : null}
      {hasVoice ? (
        <VoiceComposerPanel
          recording={voice?.recording ?? false}
          durationMs={voice?.durationMs ?? 0}
          levels={voice?.levels ?? []}
          live={voice?.live ?? null}
          voice={voice?.draft ?? null}
          stored={storedVoice}
          onStop={voice?.onStop ?? (() => {})}
          onDiscard={voice?.onDiscard ?? (() => {})}
        />
      ) : null}

      {gif || sticker || images.length > 0 ? (
        <div className="flex flex-col gap-3 px-4 pt-3">
          {sticker ? (
            <div className="relative self-start">
              <StickerAttachmentView sticker={sticker} size={STICKER_PREVIEW} />
              {onRemoveSticker ? (
                <CornerButton
                  onPress={onRemoveSticker}
                  label="Remove sticker"
                  icon={XIcon}
                  side="right"
                />
              ) : null}
            </div>
          ) : gif ? (
            <div
              className="relative self-start overflow-hidden rounded-2xl bg-muted"
              style={{
                height: 140,
                aspectRatio: aspectRatio(gif),
                maxWidth: "100%",
              }}
            >
              <img
                src={gif.url}
                alt="GIF"
                className={cn("size-full object-cover", spoiler && "blur-2xl")}
              />
              <CornerButton
                onPress={onRemoveGif}
                label="Remove GIF"
                icon={XIcon}
                side="right"
              />
            </div>
          ) : (
            <div className="flex [scrollbar-width:none] gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {images.map((image) => {
                const key = draftImageKey(image)
                return (
                  <div
                    key={key}
                    className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-muted"
                  >
                    <img
                      src={draftImageUri(image)}
                      alt=""
                      className={cn(
                        "size-full object-cover",
                        spoiler && "blur-2xl"
                      )}
                    />
                    <CornerButton
                      onPress={() => onRemoveImage(key)}
                      label="Remove image"
                      icon={XIcon}
                      side="right"
                    />
                    {onEditImage ? (
                      <CornerButton
                        onPress={() => onEditImage(key)}
                        label="Edit image"
                        icon={PencilIcon}
                        side="left"
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : null}

      {showSpoiler && onToggleSpoiler ? (
        <div className="flex px-4 pt-2.5">
          <SpoilerToggle spoiler={spoiler} onToggle={onToggleSpoiler} />
        </div>
      ) : null}
    </>
  )
}
