import { aspectRatio } from "@/lib/aspect"
import type { Snacc } from "../../../types"
import { PollView, type PollViewProps } from "../poll-view"
import { SnaccGifView } from "./snacc-gif"
import { SnaccImages } from "./snacc-images"
import { VoiceNote } from "./voice-note"

const STICKER_SIZE = 160

type SnaccMediaProps = {
  snacc: Pick<
    Snacc,
    | "id"
    | "images"
    | "voice"
    | "gif"
    | "sticker"
    | "spoiler"
    | "poll"
    | "status"
    | "mine"
  >
  onPressImage?: (index: number) => void
  poll?: Omit<PollViewProps, "poll" | "disabled">
}

export function SnaccMedia({ snacc, onPressImage, poll }: SnaccMediaProps) {
  const hasAny =
    snacc.poll ||
    snacc.voice ||
    snacc.images.length > 0 ||
    snacc.gif ||
    snacc.sticker
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
        <VoiceNote url={snacc.voice.url} durationMs={snacc.voice.duration_ms} />
      ) : null}

      <SnaccImages
        images={snacc.images}
        spoiler={snacc.spoiler}
        snaccId={snacc.id}
        onPressImage={onPressImage}
      />

      {snacc.gif ? (
        <SnaccGifView
          gif={snacc.gif}
          spoiler={snacc.spoiler}
          snaccId={snacc.id}
        />
      ) : null}

      {snacc.sticker ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={snacc.sticker.url}
          alt="Sticker"
          className="self-start object-contain"
          style={{
            height: STICKER_SIZE,
            aspectRatio: aspectRatio(snacc.sticker),
          }}
        />
      ) : null}
    </div>
  )
}
