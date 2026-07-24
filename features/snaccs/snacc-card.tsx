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
import type { PublicSnacc } from "./public"

export function SnaccCard({ snacc, href }: { snacc: PublicSnacc; href?: string }) {
  const { author } = snacc
  const media = snacc.images[0] ?? snacc.gif
  const ghost = snacc.anonymous

  const inner = (
    <div className="border-border flex flex-col gap-3 border-b px-4 py-4">
      <div className="flex gap-3">
        {ghost ? (
          <div className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-full">
            <GhostIcon className="text-muted-foreground" size={20} />
          </div>
        ) : (
          <img src={author.avatar_url} alt="" className="size-11 shrink-0 rounded-full" />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-foreground shrink truncate font-extrabold">
              {ghost ? "Ghost" : (author.display_name ?? author.username)}
            </span>
            {!ghost ? (
              <span className="text-muted-foreground shrink truncate">@{author.username}</span>
            ) : null}
            {author.university ? (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground font-semibold">
                  {author.university.acronym}
                </span>
              </>
            ) : null}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground shrink-0">{timeAgo(snacc.created_at)}</span>
            <MoreHorizontalIcon className="text-muted-foreground ml-auto shrink-0" size={20} />
          </div>

          {snacc.body ? (
            <p className="text-foreground text-[15px] leading-snug whitespace-pre-wrap">
              {snacc.body}
            </p>
          ) : null}
        </div>
      </div>

      {media ? (
        <img
          src={media.url}
          alt=""
          className="border-border ml-14 rounded-2xl border"
          style={{ aspectRatio: `${media.width} / ${media.height}` }}
        />
      ) : null}

      <div className="ml-14">
        <SnaccActions snacc={snacc} />
      </div>
    </div>
  )

  if (!href) return inner

  return (
    <Link href={href} className="hover:bg-muted/30 block transition-colors">
      {inner}
    </Link>
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
            <span className="text-muted-foreground text-sm font-bold">
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
        <span className="text-muted-foreground text-sm font-bold">{compactCount(count)}</span>
      ) : null}
    </div>
  )
}
