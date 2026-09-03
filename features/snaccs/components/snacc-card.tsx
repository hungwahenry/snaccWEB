import {
  GhostIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  RepeatIcon,
  Share2Icon,
  SmilePlusIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { compactCount, timeAgo } from "@/lib/format"
import { richText } from "@/lib/rich-text"
import { AuthorBadges } from "@/features/users/components/badges"
import type { PublicQuotedSnacc, PublicSnacc } from "../api/public"
import { VoiceNote } from "./voice-note"

export function SnaccCard({
  snacc,
  href,
}: {
  snacc: PublicSnacc
  href?: string
}) {
  const { author } = snacc
  const media = snacc.images[0] ?? snacc.gif
  const ghost = snacc.anonymous

  const inner = (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4">
      <div className="flex gap-3">
        {ghost ? (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
            <GhostIcon className="text-muted-foreground" size={20} />
          </div>
        ) : (
          <img
            src={author.avatar_url}
            alt=""
            className="size-11 shrink-0 rounded-full"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="shrink truncate font-extrabold text-foreground">
              {ghost ? "Ghost" : (author.display_name ?? author.username)}
            </span>
            {!ghost ? (
              <AuthorBadges official={author.official} premium={author.premium} size={15} />
            ) : null}
            {!ghost ? (
              <span className="shrink truncate text-muted-foreground">
                @{author.username}
              </span>
            ) : null}
            {author.university ? (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="font-semibold text-muted-foreground">
                  {author.university.acronym}
                </span>
              </>
            ) : null}
            <span className="text-muted-foreground">·</span>
            <span className="shrink-0 text-muted-foreground">
              {timeAgo(snacc.created_at)}
            </span>
            <MoreHorizontalIcon
              className="ml-auto shrink-0 text-muted-foreground"
              size={20}
            />
          </div>

          {snacc.body ? (
            <p className="text-[15px] leading-snug whitespace-pre-wrap text-foreground">
              {richText(snacc.body)}
            </p>
          ) : null}

          {snacc.resnacc_of ? (
            <QuotedSnacc snacc={snacc.resnacc_of} />
          ) : snacc.quoted_gone ? (
            <div className="rounded-2xl border border-border px-3 py-2.5 text-sm text-muted-foreground">
              This snacc is no longer available.
            </div>
          ) : null}
        </div>
      </div>

      {media ? (
        <img
          src={media.url}
          alt=""
          className="ml-14 rounded-2xl border border-border"
          style={{ aspectRatio: `${media.width} / ${media.height}` }}
        />
      ) : snacc.sticker ? (
        <img
          src={snacc.sticker.url}
          alt=""
          className="ml-14 max-h-40 self-start object-contain"
          style={{
            aspectRatio: `${snacc.sticker.width} / ${snacc.sticker.height}`,
          }}
        />
      ) : snacc.voice ? (
        <div className="ml-14">
          <VoiceNote url={snacc.voice.url} durationMs={snacc.voice.duration_ms} />
        </div>
      ) : null}

      <div className="ml-14">
        <SnaccActions snacc={snacc} />
      </div>
    </div>
  )

  if (!href) return inner

  return (
    <Link href={href} className="block transition-colors hover:bg-muted/30">
      {inner}
    </Link>
  )
}

function QuotedSnacc({ snacc }: { snacc: PublicQuotedSnacc }) {
  const { author } = snacc
  const ghost = snacc.anonymous
  const hasMedia =
    snacc.images.length > 0 || snacc.gif !== null || snacc.sticker !== null

  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-sm">
        {ghost ? (
          <GhostIcon className="text-muted-foreground" size={16} />
        ) : (
          <img src={author.avatar_url} alt="" className="size-5 rounded-full" />
        )}
        <span className="truncate font-bold text-foreground">
          {ghost ? "Ghost" : (author.display_name ?? author.username)}
        </span>
        {!ghost ? (
          <AuthorBadges official={author.official} premium={author.premium} size={13} />
        ) : null}
        {!ghost ? (
          <span className="truncate text-muted-foreground">
            @{author.username}
          </span>
        ) : null}
      </div>

      {snacc.body ? (
        <p className="line-clamp-3 text-sm leading-snug whitespace-pre-wrap text-foreground">
          {snacc.body}
        </p>
      ) : null}

      {hasMedia ? (
        <p className="text-xs text-muted-foreground">📎 Attachment</p>
      ) : null}
    </div>
  )
}

function SnaccActions({ snacc }: { snacc: PublicSnacc }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {snacc.reactions_count > 0 ? (
          <div className="flex h-9 items-center gap-1.5">
            <div className="flex">
              {snacc.reactions.slice(0, 3).map((r) => (
                <span key={r.emoji} className="text-base">
                  {r.emoji}
                </span>
              ))}
            </div>
            <span className="text-sm font-bold text-muted-foreground">
              {compactCount(snacc.reactions_count)}
            </span>
          </div>
        ) : null}
        <div className="flex h-9 items-center justify-center">
          <SmilePlusIcon className="text-muted-foreground" size={22} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <Action icon={MessageCircleIcon} count={snacc.comments_count} />
        <Action icon={RepeatIcon} count={snacc.resnaccs_count} />
        <div className="flex h-9 items-center justify-center">
          <Share2Icon className="text-muted-foreground" size={22} />
        </div>
      </div>
    </div>
  )
}

function Action({ icon: Icon, count }: { icon: LucideIcon; count: number }) {
  return (
    <div className="flex h-9 items-center gap-1.5">
      <Icon className="text-muted-foreground" size={22} />
      {count > 0 ? (
        <span className="text-sm font-bold text-muted-foreground">
          {compactCount(count)}
        </span>
      ) : null}
    </div>
  )
}
