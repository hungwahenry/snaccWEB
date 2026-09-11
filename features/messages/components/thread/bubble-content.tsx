import { LinkPreviews } from "@/features/links/containers/link-previews"
import { VoiceNotePlayer } from "@/features/voice/components/voice-note-player"
import type { VoiceNote } from "@/features/voice/types"
import { cn } from "@/lib/utils"
import type { ReplyGlimpse } from "../../types"
import { QuotedReply } from "../glimpse/quoted-reply"

export function BubbleQuote({
  glimpse,
  author,
  mine,
}: {
  glimpse: ReplyGlimpse
  author?: string | null
  mine: boolean
}) {
  return (
    <div className="px-3 pt-2.5">
      <QuotedReply glimpse={glimpse} author={author} onDark={mine} />
    </div>
  )
}

export function BubbleVoice({
  note,
  mine,
  afterQuote,
  beforeText,
}: {
  note: VoiceNote
  mine: boolean
  afterQuote: boolean
  beforeText: boolean
}) {
  return (
    <div
      className={cn(
        "px-3 pt-3",
        afterQuote && "pt-1.5",
        beforeText ? "pb-1" : "pb-3"
      )}
    >
      <VoiceNotePlayer note={note} onDark={mine} />
    </div>
  )
}

/** The words of a message, its link cards, and the edited mark; or, once it is gone, what
 * happened to it. */
export function BubbleText({
  mine,
  body,
  shownBody,
  edited,
  removed,
  spaced,
}: {
  mine: boolean
  body: string | null
  shownBody: string | null
  edited: boolean
  removed: string | null
  spaced: boolean
}) {
  const soft = mine ? "text-primary-foreground/60" : "text-muted-foreground"

  return (
    <div className={cn("px-3.5 pb-2.5", spaced ? "pt-1.5" : "pt-2.5")}>
      {removed ? (
        <p className={cn("text-base leading-6 italic", soft)}>{removed}</p>
      ) : (
        <>
          {shownBody ? (
            <p
              className={cn(
                "text-base leading-6 break-words whitespace-pre-wrap",
                mine ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {shownBody}
            </p>
          ) : null}
          <LinkPreviews
            body={body}
            className={cn("w-64 max-w-full", shownBody && "mt-1.5")}
          />
          {edited ? (
            <p className={cn("mt-0.5 text-[11px]", soft)}>Edited</p>
          ) : null}
        </>
      )}
    </div>
  )
}
