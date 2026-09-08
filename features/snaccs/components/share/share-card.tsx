import {
  EyeOffIcon,
  MessageCircleIcon,
  PlayIcon,
  RepeatIcon,
} from "lucide-react"
import { Mark } from "@/components/marketing/mark"
import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { TierName } from "@/features/users/components/flair"
import { barCount, VoiceBars } from "@/features/voice/components/voice-bars"
import { clock } from "@/features/voice/utils/clock"
import { levelsFor } from "@/features/voice/utils/levels"
import { compactCount, timeAgo } from "@/lib/format"
import type { Snacc } from "../../types"
import { TOP_REACTIONS_SHOWN } from "../../utils/constants"
import { pollFooter } from "../../utils/polls"

export const SHARE_CARD_WIDTH = 340

const CARD_PADDING = 24
const NOTE_PADDING = 12
const ROW_GAP = 12
const PLAY_SIZE = 36
const CLOCK_WIDTH = 38
const WAVE_WIDTH =
  SHARE_CARD_WIDTH -
  CARD_PADDING * 2 -
  NOTE_PADDING * 2 -
  PLAY_SIZE -
  ROW_GAP * 2 -
  CLOCK_WIDTH

function SharedVoiceNote({
  id,
  durationMs,
}: {
  id: string
  durationMs: number
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary">
        <PlayIcon className="size-4 text-primary-foreground" />
      </span>
      <div style={{ width: WAVE_WIDTH }}>
        <VoiceBars levels={levelsFor(id, barCount(WAVE_WIDTH))} height={26} />
      </div>
      <span
        style={{ width: CLOCK_WIDTH }}
        className="text-right text-xs font-medium text-muted-foreground tabular-nums"
      >
        {clock(durationMs)}
      </span>
    </div>
  )
}

export function ShareCard({ snacc }: { snacc: Snacc }) {
  const { author } = snacc
  const image = snacc.images[0]
  const gif = snacc.gif
  const sticker = snacc.sticker
  const media =
    image ??
    (gif ? { url: gif.url } : null) ??
    (sticker ? { url: sticker.url } : null)
  const ratio = image
    ? image.width / image.height
    : gif
      ? gif.width / gif.height
      : sticker
        ? sticker.width / sticker.height
        : 16 / 10

  return (
    <div
      style={{ width: SHARE_CARD_WIDTH }}
      className="flex flex-col gap-4 border border-border bg-background p-6"
    >
      <div className="flex items-center gap-3">
        {snacc.anonymous ? (
          <GhostAvatar className="size-11" iconClassName="size-6" />
        ) : (
          <UserAvatar
            alt={author.display_name ?? "Author"}
            className="size-11"
            avatarUrl={author.avatar_url}
            name={author.username}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {snacc.anonymous ? (
            <span className="truncate font-extrabold text-foreground">
              Ghost
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <TierName
                score={author.score}
                official={author.official}
                birthday={author.is_birthday}
                name={author.display_name ?? author.username}
                className="font-extrabold text-foreground"
              />
            </span>
          )}
          <span className="truncate text-sm text-muted-foreground">
            {snacc.anonymous
              ? (author.university?.acronym ?? "Anonymous")
              : `@${author.username}${author.university ? ` · ${author.university.acronym}` : ""}`}
          </span>
        </div>
      </div>

      {snacc.body ? (
        <p className="text-lg leading-6 whitespace-pre-wrap text-foreground">
          {snacc.body}
        </p>
      ) : null}

      {snacc.voice ? (
        <SharedVoiceNote
          id={snacc.voice.id}
          durationMs={snacc.voice.duration_ms}
        />
      ) : null}

      {snacc.poll ? (
        <div className="flex flex-col gap-1.5">
          {snacc.poll.options.map((option) => (
            <div
              key={option.id}
              className="flex h-10 items-center gap-2 rounded-full border border-border px-2"
            >
              {option.image ? (
                <img
                  src={option.image.thumb_url}
                  alt=""
                  className="size-7 rounded-full object-cover"
                />
              ) : null}
              <span className="truncate px-2 text-sm font-bold text-foreground">
                {option.label}
              </span>
            </div>
          ))}
          <span className="text-xs text-muted-foreground">
            {pollFooter(snacc.poll)}
          </span>
        </div>
      ) : null}

      {media ? (
        snacc.spoiler ? (
          <div
            className="flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-muted"
            style={{ aspectRatio: ratio }}
          >
            <EyeOffIcon className="size-6 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">
              Sensitive content
            </span>
          </div>
        ) : (
          <img
            src={
              "thumb_url" in media && media.thumb_url
                ? media.thumb_url
                : media.url
            }
            alt=""
            className="w-full rounded-2xl object-cover"
            style={{ aspectRatio: ratio }}
          />
        )
      ) : null}

      {snacc.reactions_count > 0 ||
      snacc.comments_count > 0 ||
      snacc.resnaccs_count > 0 ? (
        <div className="flex items-center gap-4">
          {snacc.reactions_count > 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5">
                {snacc.reactions
                  .slice(0, TOP_REACTIONS_SHOWN)
                  .map((reaction) => (
                    <span key={reaction.emoji} className="text-base">
                      {reaction.emoji}
                    </span>
                  ))}
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                {compactCount(snacc.reactions_count)}
              </span>
            </span>
          ) : null}
          {snacc.comments_count > 0 ? (
            <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
              <MessageCircleIcon className="size-4" />{" "}
              {compactCount(snacc.comments_count)}
            </span>
          ) : null}
          {snacc.resnaccs_count > 0 ? (
            <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
              <RepeatIcon className="size-4" />{" "}
              {compactCount(snacc.resnaccs_count)}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
          {timeAgo(snacc.created_at)}
        </span>
        <Mark />
      </div>
    </div>
  )
}
