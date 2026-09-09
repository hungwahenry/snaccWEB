import { StickerAttachmentView } from "@/features/stickers/components/sticker-attachment-view"
import { VoiceNotePlayer } from "@/features/voice/components/voice-note-player"
import type { Snacc } from "../../../types"
import { PollView, type PollViewProps } from "../poll-view"
import { MatchAttachment } from "@/features/football/components/match-attachment"
import { SnaccGifView } from "./snacc-gif"
import { SnaccImages } from "./snacc-images"

const STICKER_SIZE = 160

type SnaccMediaProps = {
  snacc: Pick<
    Snacc,
    | "id"
    | "images"
    | "voice"
    | "gif"
    | "sticker"
    | "match"
    | "spoiler"
    | "poll"
    | "status"
    | "mine"
  >
  onPressImage?: (index: number) => void
  onHoldImage?: (index: number) => void
  onHoldSticker?: () => void
  poll?: Omit<PollViewProps, "poll" | "disabled">
}

export function SnaccMedia({
  snacc,
  onPressImage,
  onHoldImage,
  onHoldSticker,
  poll,
}: SnaccMediaProps) {
  const hasAny =
    snacc.poll ||
    snacc.voice ||
    snacc.images.length > 0 ||
    snacc.gif ||
    snacc.sticker ||
    snacc.match
  if (!hasAny) return null

  return (
    <div className="flex flex-col gap-2">
      {snacc.poll && poll ? (
        <PollView
          {...poll}
          poll={snacc.poll}
          disabled={snacc.status === "sending"}
        />
      ) : null}

      {snacc.voice ? (
        <div className="rounded-2xl border border-border px-3 py-2">
          <VoiceNotePlayer note={snacc.voice} fill />
        </div>
      ) : null}

      <SnaccImages
        images={snacc.images}
        spoiler={snacc.spoiler}
        snaccId={snacc.id}
        onPressImage={onPressImage}
        onHoldImage={onHoldImage}
      />

      {snacc.match ? <MatchAttachment match={snacc.match} /> : null}

      {snacc.gif ? (
        <SnaccGifView
          gif={snacc.gif}
          spoiler={snacc.spoiler}
          snaccId={snacc.id}
        />
      ) : null}

      {snacc.sticker ? (
        <StickerAttachmentView
          sticker={snacc.sticker}
          size={STICKER_SIZE}
          onHold={onHoldSticker}
        />
      ) : null}
    </div>
  )
}
