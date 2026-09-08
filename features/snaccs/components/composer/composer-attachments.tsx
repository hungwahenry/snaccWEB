import { PencilIcon, XIcon } from "lucide-react"
import type { Gif } from "@/features/giphy/types"
import { StickerAttachmentView } from "@/features/stickers/components/sticker-attachment-view"
import type { DraftSticker } from "@/features/stickers/types"
import { VoiceComposerPanel } from "@/features/voice/components/voice-composer-panel"
import type { VoiceDraft } from "@/features/voice/hooks/use-voice-recorder"
import { aspectRatio } from "@/lib/aspect"
import type { SnaccVoiceNote } from "../../types"
import {
  draftImageKey,
  draftImageUri,
  type DraftImage,
} from "../../utils/draft-images"

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
  onRemoveImage,
  onEditImage,
  onRemoveGif,
  onRemoveSticker,
}: {
  images: DraftImage[]
  gif: Gif | null
  sticker?: DraftSticker | null
  storedVoice: SnaccVoiceNote | null
  voice?: ComposerVoice | null
  onRemoveImage: (key: string) => void
  onEditImage?: (key: string) => void
  onRemoveGif: () => void
  onRemoveSticker?: () => void
}) {
  const hasVoice = !!storedVoice || !!voice?.recording || !!voice?.draft
  if (!gif && !sticker && images.length === 0 && !hasVoice) return null

  return (
    <>
      {hasVoice ? (
        <VoiceComposerPanel
          recording={voice?.recording ?? false}
          durationMs={voice?.durationMs ?? 0}
          levels={voice?.levels ?? []}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gif.url} alt="GIF" className="size-full object-cover" />
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draftImageUri(image)}
                      alt=""
                      className="size-full object-cover"
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
    </>
  )
}
