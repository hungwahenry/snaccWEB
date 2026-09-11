import {
  ChartBarBigIcon,
  EyeOffIcon,
  QuoteIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react"
import { StickerAttachmentView } from "@/features/stickers/components/sticker-attachment-view"
import { VoiceNotePlayer } from "@/features/voice/components/voice-note-player"
import { aspectRatio } from "@/lib/aspect"
import type { GlimpsedSnacc } from "../../types"
import { glimpseOf, type GlimpseChipKind } from "../../utils/preview"

const THUMB = 56

const CHIP_ICON: Record<GlimpseChipKind, LucideIcon> = {
  poll: ChartBarBigIcon,
  match: TrophyIcon,
  quote: QuoteIcon,
  sensitive: EyeOffIcon,
}

/** A snacc in brief, for the space above a reply: its words and a taste of what it carries. */
export function SnaccGlimpse({
  snacc,
  lines = 4,
}: {
  snacc: GlimpsedSnacc
  lines?: number
}) {
  const glimpse = glimpseOf(snacc)

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {glimpse.body ? (
        <p
          className="text-sm leading-5 break-words whitespace-pre-wrap text-foreground"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: lines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {glimpse.body}
        </p>
      ) : null}

      {glimpse.voice ? (
        <div className="max-w-80 rounded-2xl border border-border px-3 py-2">
          <VoiceNotePlayer note={glimpse.voice} fill />
        </div>
      ) : null}

      {glimpse.thumbs ? (
        <div className="flex gap-1.5">
          {glimpse.thumbs.urls.map((url, index) => (
            <span
              key={url}
              className="relative overflow-hidden rounded-lg bg-muted"
              style={{ width: THUMB, height: THUMB }}
            >
              <img
                src={url}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
              {glimpse.thumbs &&
              glimpse.thumbs.extra > 0 &&
              index === glimpse.thumbs.urls.length - 1 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-extrabold text-white">
                  +{glimpse.thumbs.extra}
                </span>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      {glimpse.gif ? (
        <img
          src={glimpse.gif.url}
          alt="GIF"
          loading="lazy"
          className="self-start rounded-lg bg-muted object-cover"
          style={{ height: THUMB, aspectRatio: aspectRatio(glimpse.gif) }}
        />
      ) : null}

      {glimpse.sticker ? (
        <StickerAttachmentView sticker={glimpse.sticker} size={THUMB} />
      ) : null}

      {glimpse.chips.map((chip) => {
        const Icon = CHIP_ICON[chip.kind]
        return (
          <span
            key={chip.kind}
            className="flex max-w-full items-center gap-1.5 self-start rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate">{chip.label}</span>
          </span>
        )
      })}
    </div>
  )
}
