import { XIcon } from "lucide-react"
import type { Gif } from "@/features/giphy/types"
import { aspectRatio } from "@/lib/aspect"
import {
  draftImageKey,
  draftImageUri,
  type DraftImage,
} from "../../utils/draft-images"
import type { SnaccVoiceNote } from "../../types"
import { VoiceNotePlayer } from "@/features/voice/components/voice-note-player"

function RemoveButton({
  onPress,
  label,
}: {
  onPress: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow active:opacity-70"
    >
      <XIcon className="size-4" />
    </button>
  )
}

export function ComposerAttachments({
  images,
  gif,
  storedVoice,
  onRemoveImage,
  onRemoveGif,
}: {
  images: DraftImage[]
  gif: Gif | null
  storedVoice: SnaccVoiceNote | null
  onRemoveImage: (key: string) => void
  onRemoveGif: () => void
}) {
  if (!gif && images.length === 0 && !storedVoice) return null

  return (
    <div className="flex flex-col gap-3 px-4 pt-3">
      {storedVoice ? (
        <div className="rounded-2xl border border-border px-3 py-2">
          <VoiceNotePlayer note={storedVoice} fill />
        </div>
      ) : null}

      {gif ? (
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
          <RemoveButton onPress={onRemoveGif} label="Remove GIF" />
        </div>
      ) : images.length > 0 ? (
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
                <RemoveButton
                  onPress={() => onRemoveImage(key)}
                  label="Remove image"
                />
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
