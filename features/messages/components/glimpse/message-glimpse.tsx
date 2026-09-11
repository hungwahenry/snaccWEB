import { ThumbStrip } from "@/components/ui/thumb-strip"
import { MomentThumb } from "@/features/moments/components/moment-thumb"
import { StickerAttachmentView } from "@/features/stickers/components/sticker-attachment-view"
import { VoiceNotePlayer } from "@/features/voice/components/voice-note-player"
import { cn } from "@/lib/utils"
import type { GlimpseMedia, MessageGlimpse } from "../../types"
import { AttachmentChips } from "./attachment-chips"

const THUMB = 48

/** A whole message in small: its words, what it carried, and the moment it answered. */
export function MessageGlimpseView({ glimpse }: { glimpse: MessageGlimpse }) {
  return (
    <span className="flex min-w-0 items-start gap-2">
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        {glimpse.text ? (
          <span
            className={cn(
              "line-clamp-2 text-sm break-words",
              glimpse.removed
                ? "text-muted-foreground italic"
                : "text-foreground"
            )}
          >
            {glimpse.text}
          </span>
        ) : null}
        {glimpse.media ? <GlimpseMediaView media={glimpse.media} /> : null}
        <AttachmentChips chips={glimpse.chips} />
      </span>

      {glimpse.moment ? (
        <MomentThumb
          size="small"
          body={glimpse.moment.body}
          background={glimpse.moment.background}
          imageUrl={glimpse.moment.image_url}
        />
      ) : null}
    </span>
  )
}

function GlimpseMediaView({ media }: { media: GlimpseMedia }) {
  switch (media.kind) {
    case "voice":
      return (
        <span className="block rounded-2xl border border-border bg-background px-3 py-2">
          <VoiceNotePlayer note={media.note} fill />
        </span>
      )
    case "photos":
      return <ThumbStrip urls={media.urls} extra={media.extra} size={THUMB} />
    case "gif":
      return <ThumbStrip urls={[media.url]} size={THUMB} />
    case "sticker":
      return <StickerAttachmentView sticker={media.sticker} size={THUMB} />
  }
}
