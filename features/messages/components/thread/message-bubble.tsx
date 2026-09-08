import { LinkPreviews } from "@/features/links/containers/link-previews"
import { VoiceNote } from "@/features/snaccs/components/card/media/voice-note"
import { withoutShareLinks } from "@/lib/share-links"
import { cn } from "@/lib/utils"
import type { Message, MessageGif, MessageImage } from "../../types"
import { shownImagesOf, viewOnceOf } from "../../utils/images"
import { removedLabel, replyPreview } from "../../utils/preview"
import { MessageImages } from "./message-images"
import { MessageMoney } from "./message-money"
import { QuotedMomentCard } from "./quoted-moment"
import { ViewOnceCard } from "./view-once-card"

const GIF_WIDTH = 220
const GIF_MIN_RATIO = 3 / 4
const GIF_MAX_RATIO = 16 / 9
const STICKER_SIZE = 140

export type MessageBubbleProps = {
  message: Message
  firstInBurst: boolean
  lastInBurst: boolean
  onPressImage: (index: number) => void
  onOpenViewOnce: (photo: MessageImage) => void
  openingViewOnce: boolean
  onRetry: () => void
  onDiscard: () => void
}

export function MessageBubble({
  message,
  firstInBurst,
  lastInBurst,
  onPressImage,
  onOpenViewOnce,
  openingViewOnce,
  onRetry,
  onDiscard,
}: MessageBubbleProps) {
  const mine = message.mine
  const shownBody = message.body ? withoutShareLinks(message.body) : null
  const viewOnce = viewOnceOf(message)
  const shown = shownImagesOf(message)
  const voice = message.removed ? null : message.voice
  const hasText =
    (message.body !== null && !message.money) ||
    message.edited ||
    message.removed
  const money = message.removed ? null : message.money
  const bubbled =
    hasText ||
    voice !== null ||
    message.reply_to !== null ||
    message.moment !== null ||
    money !== null ||
    viewOnce !== undefined

  const corners = mine
    ? cn(!firstInBurst && "rounded-tr-md", !lastInBurst && "rounded-br-md")
    : cn(!firstInBurst && "rounded-tl-md", !lastInBurst && "rounded-bl-md")

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        mine ? "items-end" : "items-start",
        message.status === "sending" && "opacity-60"
      )}
    >
      {shown.length > 0 ? (
        <MessageImages images={shown} onPressImage={onPressImage} />
      ) : null}

      {message.removed || !message.sticker ? null : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={message.sticker.url}
          alt="Sticker"
          style={{ height: STICKER_SIZE }}
          className="object-contain"
        />
      )}

      {message.removed || !message.gif ? null : (
        <MessageGifView gif={message.gif} />
      )}

      {bubbled ? (
        <div
          className={cn(
            "overflow-hidden rounded-2xl",
            corners,
            mine ? "bg-primary" : "bg-muted"
          )}
        >
          {viewOnce ? (
            <ViewOnceCard
              photo={viewOnce}
              mine={mine}
              opening={openingViewOnce}
              onPress={() => onOpenViewOnce(viewOnce)}
            />
          ) : null}

          {money ? (
            <MessageMoney
              money={money}
              note={message.removed ? null : message.body}
              mine={mine}
            />
          ) : null}

          {message.moment ? (
            <QuotedMomentCard moment={message.moment} mine={mine} />
          ) : null}

          {message.reply_to ? (
            <p
              className={cn(
                "line-clamp-2 px-3.5 pt-2.5 text-xs",
                message.reply_to.removed && "italic",
                mine ? "text-primary-foreground/55" : "text-muted-foreground"
              )}
            >
              {replyPreview(message.reply_to)}
            </p>
          ) : null}

          {voice ? (
            <div
              className={cn(
                "px-3 pt-3",
                message.reply_to && "pt-1.5",
                hasText ? "pb-1" : "pb-3"
              )}
            >
              <VoiceNote
                url={voice.url}
                durationMs={voice.duration_ms}
                tone={mine ? "inverted" : "default"}
              />
            </div>
          ) : null}

          {hasText ? (
            <div
              className={cn(
                "px-3.5 pb-2.5",
                message.reply_to || message.moment || voice
                  ? "pt-1.5"
                  : "pt-2.5"
              )}
            >
              {message.removed ? (
                <p
                  className={cn(
                    "text-base leading-6 italic",
                    mine
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  )}
                >
                  {removedLabel(message)}
                </p>
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
                    body={message.body}
                    className={cn("w-64 max-w-full", shownBody && "mt-1.5")}
                  />
                  {message.edited ? (
                    <p
                      className={cn(
                        "mt-0.5 text-[11px]",
                        mine
                          ? "text-primary-foreground/50"
                          : "text-muted-foreground"
                      )}
                    >
                      Edited
                    </p>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {message.status === "failed" ? (
        <div className="mt-1 flex items-center gap-3 pr-1 text-[11px]">
          <span className="text-destructive">Not sent</span>
          <button
            type="button"
            onClick={onRetry}
            className="font-bold text-foreground"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="text-muted-foreground"
          >
            Discard
          </button>
        </div>
      ) : null}

      {message.reactions.length > 0 ? (
        <div
          className={cn(
            "-mt-2 flex gap-1",
            mine ? "justify-end pr-3" : "justify-start pl-3"
          )}
        >
          {message.reactions.map((reaction) => (
            <span
              key={`${reaction.emoji}-${String(reaction.mine)}`}
              className={cn(
                "rounded-full border bg-background px-1.5 py-0.5 text-xs",
                reaction.mine ? "border-foreground/40" : "border-border"
              )}
            >
              {reaction.emoji}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function MessageGifView({ gif }: { gif: MessageGif }) {
  const ratio = Math.min(
    GIF_MAX_RATIO,
    Math.max(GIF_MIN_RATIO, gif.height > 0 ? gif.width / gif.height : 1)
  )
  return (
    <div
      className="overflow-hidden rounded-2xl bg-muted"
      style={{ width: GIF_WIDTH, aspectRatio: ratio }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={gif.url}
        alt="GIF"
        className="size-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
